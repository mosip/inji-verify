package io.inji.verify.services.impl;

import com.nimbusds.jose.JOSEException;
import io.inji.verify.dto.submission.*;
import io.inji.verify.enums.VPResultStatus;
import io.inji.verify.exception.VPSubmissionNotFoundException;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.models.VPSubmission;
import io.inji.verify.repository.VPSubmissionRepository;
import io.inji.verify.utils.VerificationUtils;
import io.mosip.vercred.vcverifier.PresentationVerifier;
import io.mosip.vercred.vcverifier.data.PresentationVerificationResult;
import io.mosip.vercred.vcverifier.data.VCResult;
import io.mosip.vercred.vcverifier.data.VPVerificationStatus;
import io.mosip.vercred.vcverifier.data.VerificationStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class VerifiablePresentationSubmissionServiceImplTest {

    @Mock
    private VPSubmissionRepository vpSubmissionRepository;

    @Mock
    private PresentationVerifier presentationVerifier;

    @Mock
    private VerifiablePresentationRequestServiceImpl verifiablePresentationRequestService;

    @InjectMocks
    private VerifiablePresentationSubmissionServiceImpl verifiablePresentationSubmissionService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSubmit_Success() {
        VPSubmissionDto vpSubmissionDto = new VPSubmissionDto("vpToken123", 
            new PresentationSubmissionDto("id", "dId", new ArrayList<>()),
                "state123", null, null);

        verifiablePresentationSubmissionService.submit(vpSubmissionDto);

        verify(vpSubmissionRepository, times(1)).save(any(VPSubmission.class));
        verify(verifiablePresentationRequestService, times(1)).invokeVpRequestStatusListener("state123");
    }

    @Test
    public void testGetVPResult_Success_JSONObject() throws VPSubmissionNotFoundException, ParseException, JOSEException {
        List<String> requestIds = Arrays.asList("req123");
        List<VCResult> vcResults = Arrays.asList(new VCResult("", VerificationStatus.SUCCESS));
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[\"{\\\"verifiableCredential\\\":{\\\"credential\\\":{}}}\"]}", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))),null,null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(presentationVerifier.verify(anyString())).thenReturn(
            new PresentationVerificationResult(VPVerificationStatus.VALID, vcResults));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        try (MockedStatic<VerificationUtils> utilities = Mockito.mockStatic(VerificationUtils.class)) {
            utilities.when(() -> VerificationUtils.verifyEd25519Signature(any())).thenAnswer(invocation -> null);

            VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

            assertNotNull(resultDto);
            assertEquals(VPResultStatus.SUCCESS, resultDto.getVpResultStatus());
            assertEquals(1, resultDto.getVcResults().size());
        }
    }

    @Test
    public void testGetVPResult_Success_Base64EncodedString() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";
        
        String vpTokenJson = "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}";
        String base64Token = Base64.getUrlEncoder().encodeToString(vpTokenJson.getBytes());
        
        List<VCResult> vcResults = Arrays.asList(new VCResult("", VerificationStatus.SUCCESS));
        VPSubmission vpSubmission = new VPSubmission("state123", "\"" + base64Token + "\"", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(presentationVerifier.verify(anyString())).thenReturn(
            new PresentationVerificationResult(VPVerificationStatus.VALID, vcResults));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.SUCCESS, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_Success_JSONArray() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";
        
        List<VCResult> vcResults1 = Arrays.asList(new VCResult("vc1", VerificationStatus.SUCCESS));
        List<VCResult> vcResults2 = Arrays.asList(new VCResult("vc2", VerificationStatus.SUCCESS));
        
        VPSubmission vpSubmission = new VPSubmission("state123", 
            "[{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}, " +
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}]", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(presentationVerifier.verify(anyString()))
            .thenReturn(new PresentationVerificationResult(VPVerificationStatus.VALID, vcResults1))
            .thenReturn(new PresentationVerificationResult(VPVerificationStatus.VALID, vcResults2));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.SUCCESS, resultDto.getVpResultStatus());
        assertEquals(2, resultDto.getVcResults().size());
    }

    @Test
    public void testGetVPResult_Success_JSONArrayWithBase64() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";
        
        String vpToken1Json = "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}";
        String base64Token1 = Base64.getUrlEncoder().encodeToString(vpToken1Json.getBytes());
        
        List<VCResult> vcResults = Arrays.asList(new VCResult("", VerificationStatus.SUCCESS));
        
        VPSubmission vpSubmission = new VPSubmission("state123", 
            "[\"" + base64Token1 + "\", {\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}]", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(presentationVerifier.verify(anyString()))
            .thenReturn(new PresentationVerificationResult(VPVerificationStatus.VALID, vcResults));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.SUCCESS, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_VPSubmissionNotFound() {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(new ArrayList<>());

        assertThrows(VPSubmissionNotFoundException.class, 
            () -> verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId));
    }

    @Test
    public void testGetVPResult_VerificationFailed_InvalidVPStatus() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(presentationVerifier.verify(anyString())).thenReturn(
            new PresentationVerificationResult(VPVerificationStatus.INVALID, new ArrayList<>()));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_VerificationFailed_InvalidVCStatus() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        List<VCResult> vcResults = Arrays.asList(new VCResult("", VerificationStatus.INVALID));
        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(presentationVerifier.verify(anyString())).thenReturn(
            new PresentationVerificationResult(VPVerificationStatus.VALID, vcResults));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_VerificationFailed_ExpiredVCStatus() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        List<VCResult> vcResults = Arrays.asList(new VCResult("", VerificationStatus.EXPIRED));
        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(presentationVerifier.verify(anyString())).thenReturn(
            new PresentationVerificationResult(VPVerificationStatus.VALID, vcResults));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_TokenMatchingFailed_NullVpToken() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", "null", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_TokenMatchingFailed_NullRequest() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId)).thenReturn(null);

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_TokenMatchingFailed_EmptyDescriptorMap() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", new ArrayList<>()), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_TokenMatchingFailed_NullDescriptorMap() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", null), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_ExceptionHandling_RuntimeException() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());
        when(presentationVerifier.verify(anyString())).thenThrow(new RuntimeException("Verification error"));

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_InvalidVPTokenFormat() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", "12345", // Invalid format (number)
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_InvalidItemInVPTokenArray() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", "[123, \"invalid\"]", // Invalid array items
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_InvalidBase64InArray() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", "[\"invalid-base64!!!\"]", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_InvalidBase64String() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", "\"invalid-base64!!!\"", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_EmptyVpVerificationStatuses() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(presentationVerifier.verify(anyString())).thenReturn(
            new PresentationVerificationResult(VPVerificationStatus.VALID, Arrays.asList(new VCResult("", VerificationStatus.SUCCESS))));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.SUCCESS, resultDto.getVpResultStatus());
    }

    @Test
    public void testIsVPTokenMatching_AllValidConditions() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        List<VCResult> vcResults = Arrays.asList(new VCResult("", VerificationStatus.SUCCESS));
        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(presentationVerifier.verify(anyString())).thenReturn(
            new PresentationVerificationResult(VPVerificationStatus.VALID, vcResults));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.SUCCESS, resultDto.getVpResultStatus());
        verify(verifiablePresentationRequestService, times(1)).getLatestAuthorizationRequestFor(transactionId);
    }

    @Test
    public void testGetVPResult_VerificationFailedException() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());
        
        List<VCResult> vcResults = Arrays.asList(new VCResult("", VerificationStatus.INVALID));
        when(presentationVerifier.verify(anyString())).thenReturn(
            new PresentationVerificationResult(VPVerificationStatus.VALID, vcResults));

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test 
    public void testGetVPResult_TokenMatchingFailedException() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId)).thenReturn(null);

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetCombinedVerificationStatus_EmptyLists() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(presentationVerifier.verify(anyString())).thenReturn(
            new PresentationVerificationResult(VPVerificationStatus.VALID, new ArrayList<>()));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_MixedVerificationStatuses() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        List<VCResult> vcResults = Arrays.asList(
            new VCResult("vc1", VerificationStatus.SUCCESS),
            new VCResult("vc2", VerificationStatus.EXPIRED),
            new VCResult("vc3", VerificationStatus.INVALID)
        );
        
        VPSubmission vpSubmission = new VPSubmission("state123", 
            "[{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}, " +
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}]", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(presentationVerifier.verify(anyString()))
            .thenReturn(new PresentationVerificationResult(VPVerificationStatus.VALID, vcResults))
            .thenReturn(new PresentationVerificationResult(VPVerificationStatus.INVALID, new ArrayList<>()));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_AllVerificationStatusTypes() throws VPSubmissionNotFoundException {
        List<String> requestIds = Arrays.asList("req123");
        String transactionId = "tx123";

        List<VCResult> successResults = Arrays.asList(new VCResult("vc_success", VerificationStatus.SUCCESS));
        List<VCResult> expiredResults = Arrays.asList(new VCResult("vc_expired", VerificationStatus.EXPIRED));
        List<VCResult> invalidResults = Arrays.asList(new VCResult("vc_invalid", VerificationStatus.INVALID));
        
        VPSubmission vpSubmission = new VPSubmission("state123", 
            "[{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}, " +
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}, " +
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}]", 
            new PresentationSubmissionDto("id", "dId", Arrays.asList(
                new DescriptorMapDto("id","format","path", new PathNestedDto(
                        "format","path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(Arrays.asList(vpSubmission));
        when(presentationVerifier.verify(anyString()))
            .thenReturn(new PresentationVerificationResult(VPVerificationStatus.VALID, successResults))
            .thenReturn(new PresentationVerificationResult(VPVerificationStatus.VALID, expiredResults))
            .thenReturn(new PresentationVerificationResult(VPVerificationStatus.VALID, invalidResults));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
        assertEquals(3, resultDto.getVcResults().size());
        
        assertTrue(resultDto.getVcResults().stream()
            .anyMatch(vc -> vc.getVerificationStatus() == VerificationStatus.SUCCESS));
        assertTrue(resultDto.getVcResults().stream()
            .anyMatch(vc -> vc.getVerificationStatus() == VerificationStatus.EXPIRED));
        assertTrue(resultDto.getVcResults().stream()
            .anyMatch(vc -> vc.getVerificationStatus() == VerificationStatus.INVALID));
    }
}
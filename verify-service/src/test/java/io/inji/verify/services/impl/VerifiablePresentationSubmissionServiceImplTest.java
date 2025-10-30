package io.inji.verify.services.impl;

import io.inji.verify.dto.result.VCResultDto;
import io.inji.verify.dto.submission.*;
import io.inji.verify.enums.VPResultStatus;
import io.inji.verify.exception.VPSubmissionNotFoundException;
import io.inji.verify.exception.VPSubmissionWalletError;
import io.inji.verify.models.AuthorizationRequestCreateResponse;
import io.inji.verify.models.VPSubmission;
import io.inji.verify.repository.VPSubmissionRepository;
import io.mosip.vercred.vcverifier.CredentialsVerifier;
import io.mosip.vercred.vcverifier.PresentationVerifier;
import io.mosip.vercred.vcverifier.data.PresentationVerificationResult;
import io.mosip.vercred.vcverifier.data.VCResult;
import io.mosip.vercred.vcverifier.data.VPVerificationStatus;
import io.mosip.vercred.vcverifier.data.VerificationResult;
import io.mosip.vercred.vcverifier.data.VerificationStatus;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
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

    @Mock
    private CredentialsVerifier credentialsVerifier;

    @InjectMocks
    private VerifiablePresentationSubmissionServiceImpl verifiablePresentationSubmissionService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        verifiablePresentationSubmissionService = new VerifiablePresentationSubmissionServiceImpl(
            vpSubmissionRepository, credentialsVerifier, presentationVerifier, verifiablePresentationRequestService);
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
    public void testGetVPResult_Success_JSONObject() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        List<VCResult> vcResults = List.of(new VCResult("Verified successfully", VerificationStatus.SUCCESS)); // ✅ fix
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission(
                "state123",
                "{\"type\":[\"VerifiablePresentation\"],\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[{\"type\":[\"VerifiablePresentation\"]}]}",
                new PresentationSubmissionDto("id", "dId", List.of(
                        new DescriptorMapDto("id", "format", "path", new PathNestedDto("format", "path"))
                )),
                null,
                null
        );

        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(presentationVerifier.verify(anyString()))
                .thenReturn(new PresentationVerificationResult(VPVerificationStatus.VALID, vcResults));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());
        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.SUCCESS, resultDto.getVpResultStatus());
        assertEquals(1, resultDto.getVcResults().size());
    }

    @Test
    public void testGetVPResult_Success_Base64EncodedString() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";
        
        String vpTokenJson = "{\"type\":[\"VerifiablePresentation\"],\"proof\":{\"type\":\"Ed25519Signature2018\"},\"VerifiablePresentation\":[{\"type\":[\"VerifiablePresentation\"]}]}";
        String base64Token = Base64.getUrlEncoder().encodeToString(vpTokenJson.getBytes());
        
        List<VCResult> vcResults = List.of(new VCResult("", VerificationStatus.SUCCESS));
        VPSubmission vpSubmission = new VPSubmission("state123", "\"" + base64Token + "\"",
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);

        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(presentationVerifier.verify(anyString())).thenReturn(
            new PresentationVerificationResult(VPVerificationStatus.VALID, vcResults));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.SUCCESS, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_Success_JSONArray() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        List<VCResult> vcResults1 = List.of(new VCResult("vc1", VerificationStatus.SUCCESS));
        List<VCResult> vcResults2 = List.of(new VCResult("vc2", VerificationStatus.SUCCESS));

        VPSubmission vpSubmission = new VPSubmission(
                "state123",
                "[" +
                        "{\"type\":[\"VerifiablePresentation\"],\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}," +
                        "{\"type\":[\"VerifiablePresentation\"],\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}" +
                        "]",
                new PresentationSubmissionDto(
                        "id", "dId",
                        List.of(new DescriptorMapDto("id", "format", "path", new PathNestedDto("format", "path")))
                ),
                null,
                null
        );

        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
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
    public void testGetVPResult_Success_JSONArrayWithBase64() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        String vpToken1Json = "{\"type\":[\"VerifiablePresentation\"],\"proof\":{\"type\":\"Ed25519Signature2018\"},\"VerifiablePresentation\":[{\"type\":[\"VerifiablePresentation\"]}]}";
        String base64Token1 = Base64.getUrlEncoder().encodeToString(vpToken1Json.getBytes());
        
        List<VCResult> vcResults = List.of(new VCResult("", VerificationStatus.SUCCESS));
        
        VPSubmission vpSubmission = new VPSubmission("state123", 
            "[\"" + base64Token1 + "\", \"{\\\"type\\\":[\\\"VerifiablePresentation\\\"],\\\"proof\\\":{\\\"type\\\":\\\"Ed25519Signature2018\\\"},\\\"VerifiablePresentation\\\":[{\\\"type\\\":[\\\"VerifiablePresentation\\\"]}]}\"]",
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
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
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(new ArrayList<>());

        assertThrows(VPSubmissionNotFoundException.class, 
            () -> verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId));
    }

    @Test
    public void testGetVPResult_VerificationFailed_InvalidVPStatus() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(presentationVerifier.verify(anyString())).thenReturn(
            new PresentationVerificationResult(VPVerificationStatus.INVALID, new ArrayList<>()));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_VerificationFailed_InvalidVCStatus() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        List<VCResult> vcResults = List.of(new VCResult("", VerificationStatus.INVALID));
        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(presentationVerifier.verify(anyString())).thenReturn(
            new PresentationVerificationResult(VPVerificationStatus.VALID, vcResults));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_VerificationFailed_ExpiredVCStatus() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        List<VCResult> vcResults = List.of(new VCResult("", VerificationStatus.EXPIRED));
        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(presentationVerifier.verify(anyString())).thenReturn(
            new PresentationVerificationResult(VPVerificationStatus.VALID, vcResults));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_TokenMatchingFailed_NullVpToken() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", "null", 
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_TokenMatchingFailed_NullRequest() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId)).thenReturn(null);

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_TokenMatchingFailed_EmptyDescriptorMap() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", new ArrayList<>()), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_TokenMatchingFailed_NullDescriptorMap() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", null), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_ExceptionHandling_RuntimeException() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());
        when(presentationVerifier.verify(anyString())).thenThrow(new RuntimeException("Verification error"));

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_InvalidVPTokenFormat() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", "12345", // Invalid format (number)
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_InvalidItemInVPTokenArray() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", "[123, \"invalid\"]", // Invalid array items
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_InvalidBase64InArray() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", "[\"invalid-base64!!!\"]", 
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_InvalidBase64String() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", "\"invalid-base64!!!\"", 
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_EmptyVpVerificationStatuses() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123",
                "{\"type\":[\"VerifiablePresentation\"],\"proof\":{\"type\":\"Ed25519Signature2018\"},\"VerifiablePresentation\":[{\"type\":[\"VerifiablePresentation\"]}]}",
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(presentationVerifier.verify(anyString())).thenReturn(
            new PresentationVerificationResult(VPVerificationStatus.VALID, List.of(new VCResult("", VerificationStatus.SUCCESS))));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.SUCCESS, resultDto.getVpResultStatus());
    }

    @Test
    public void testIsVPTokenMatching_AllValidConditions() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        List<VCResult> vcResults = List.of(new VCResult("", VerificationStatus.SUCCESS));
        VPSubmission vpSubmission = new VPSubmission("state123",
                "{\"type\":[\"VerifiablePresentation\"],\"proof\":{\"type\":\"Ed25519Signature2018\"},\"VerifiablePresentation\":[{\"type\":[\"VerifiablePresentation\"]}]}",
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
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
    public void testGetVPResult_VerificationFailedException() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId))
            .thenReturn(new AuthorizationRequestCreateResponse());
        
        List<VCResult> vcResults = List.of(new VCResult("", VerificationStatus.INVALID));
        when(presentationVerifier.verify(anyString())).thenReturn(
            new PresentationVerificationResult(VPVerificationStatus.VALID, vcResults));

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test 
    public void testGetVPResult_TokenMatchingFailedException() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", 
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", 
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId)).thenReturn(null);

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_MixedVerificationStatuses() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        List<VCResult> vcResults = Arrays.asList(
            new VCResult("vc1", VerificationStatus.SUCCESS),
            new VCResult("vc2", VerificationStatus.EXPIRED),
            new VCResult("vc3", VerificationStatus.INVALID)
        );
        
        VPSubmission vpSubmission = new VPSubmission("state123", 
            "[{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}, " +
            "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}]", 
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
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
    public void testGetVPResult_AllVerificationStatusTypes() throws VPSubmissionNotFoundException, VPSubmissionWalletError {
        List<String> requestIds = List.of("req123");
        String transactionId = "tx123";

        List<VCResult> successResults = List.of(new VCResult("vc_success", VerificationStatus.SUCCESS));
        List<VCResult> expiredResults = List.of(new VCResult("vc_expired", VerificationStatus.EXPIRED));
        List<VCResult> invalidResults = List.of(new VCResult("vc_invalid", VerificationStatus.INVALID));
        
        VPSubmission vpSubmission = new VPSubmission("state123",
            "[{\"type\":[\"VerifiablePresentation\"],\"proof\":{\"type\":\"Ed25519Signature2018\"},\"VerifiablePresentation\":[{\"type\":[\"VerifiablePresentation\"]}]}, " +
            "{\"type\":[\"VerifiablePresentation\"],\"proof\":{\"type\":\"Ed25519Signature2018\"},\"VerifiablePresentation\":[{\"type\":[\"VerifiablePresentation\"]}]}, " +
            "{\"type\":[\"VerifiablePresentation\"],\"proof\":{\"type\":\"Ed25519Signature2018\"},\"VerifiablePresentation\":[{\"type\":[\"VerifiablePresentation\"]}]}]",
            new PresentationSubmissionDto("id", "dId", List.of(
                    new DescriptorMapDto("id", "format", "path", new PathNestedDto(
                            "format", "path")))), null, null);
        
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
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

    @Test
    public void testProcessJsonVpTokens_SimpleVC() {
        List<JSONObject> jsonVpTokens = new ArrayList<>();
        List<VCResultDto> verificationResults = new ArrayList<>();
        List<VPVerificationStatus> vpVerificationStatuses = new ArrayList<>();
        JSONArray types = new JSONArray();
        types.put("VerifiableCredential");
        JSONObject vc = new JSONObject();
        vc.put("type", types);
        jsonVpTokens.add(vc);
        VerificationResult mockResult = mock(VerificationResult.class);

        when(mockResult.getVerificationStatus()).thenReturn(true);
        when(credentialsVerifier.verify(anyString(), eq(io.mosip.vercred.vcverifier.constants.CredentialFormat.LDP_VC)))
            .thenReturn(mockResult);
        PresentationVerificationResult presResult = new PresentationVerificationResult(VPVerificationStatus.VALID, new ArrayList<>());
        when(presentationVerifier.verify(anyString())).thenReturn(presResult);
        verifiablePresentationSubmissionService.processJsonVpTokens(jsonVpTokens, verificationResults, vpVerificationStatuses);

        assertFalse(verificationResults.isEmpty());
        assertTrue(vpVerificationStatuses.isEmpty());
    }

    @Test
    public void testProcessSdJwtVpTokens_Success() {
        List<String> sdJwtVpTokens = List.of("sdjwt-token");
        List<VCResultDto> verificationResults = new ArrayList<>();
        VerificationResult mockResult = mock(VerificationResult.class);

        when(mockResult.getVerificationStatus()).thenReturn(true);
        when(credentialsVerifier.verify(anyString(), eq(io.mosip.vercred.vcverifier.constants.CredentialFormat.VC_SD_JWT)))
            .thenReturn(mockResult);
        verifiablePresentationSubmissionService.processSdJwtVpTokens(sdJwtVpTokens, verificationResults);

        assertFalse(verificationResults.isEmpty());
    }

    @Test
    public void testProcessJsonVpTokens_VPWithVCs() {
        List<JSONObject> jsonVpTokens = new ArrayList<>();
        List<VCResultDto> verificationResults = new ArrayList<>();
        List<VPVerificationStatus> vpVerificationStatuses = new ArrayList<>();
        JSONArray types = new JSONArray();
        types.put("VerifiablePresentation");
        JSONObject vp = new JSONObject();
        vp.put("type", types);
        jsonVpTokens.add(vp);
        PresentationVerificationResult presResult = new PresentationVerificationResult(VPVerificationStatus.VALID, List.of(new VCResult("vc", VerificationStatus.SUCCESS)));

        when(presentationVerifier.verify(anyString())).thenReturn(presResult);
        verifiablePresentationSubmissionService.processJsonVpTokens(jsonVpTokens, verificationResults, vpVerificationStatuses);

        assertFalse(verificationResults.isEmpty());
        assertFalse(vpVerificationStatuses.isEmpty());
    }

    @Test
    public void testExtractTokens_MixedArray() {
        String vcJson = "{\"type\":[\"VerifiableCredential\"]}";
        String base64Token = Base64.getUrlEncoder().encodeToString(vcJson.getBytes());
        String sdJwtToken = "sdjwt-token-value";
        String arrayToken = "[\"" + base64Token + "\",\"" + sdJwtToken + "\"]";
        List<JSONObject> jsonVpTokens = new ArrayList<>();
        List<String> sdJwtVpTokens = new ArrayList<>();
        verifiablePresentationSubmissionService.extractTokens(arrayToken, jsonVpTokens, sdJwtVpTokens);

        assertEquals(1, jsonVpTokens.size());
        assertEquals(0, sdJwtVpTokens.size());
    }

    @Test
    public void testExtractTokens_InvalidBase64() {
        String arrayToken = "[\"invalid-base64!!!\"]";
        List<JSONObject> jsonVpTokens = new ArrayList<>();
        List<String> sdJwtVpTokens = new ArrayList<>();
        verifiablePresentationSubmissionService.extractTokens(arrayToken, jsonVpTokens, sdJwtVpTokens);

        assertTrue(jsonVpTokens.isEmpty());
        assertTrue(sdJwtVpTokens.isEmpty());
    }
}
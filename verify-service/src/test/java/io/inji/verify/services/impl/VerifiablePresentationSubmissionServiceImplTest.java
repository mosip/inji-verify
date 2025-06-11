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
        VPSubmissionDto vpSubmissionDto = new VPSubmissionDto("vpToken123", new PresentationSubmissionDto("id", "dId", new ArrayList<>()), "state123");

        verifiablePresentationSubmissionService.submit(vpSubmissionDto);

        verify(vpSubmissionRepository, times(1)).save(any(VPSubmission.class));
        verify(verifiablePresentationRequestService, times(1)).invokeVpRequestStatusListener("state123");
    }

    @Test
    public void testGetVPResult_Success() throws VPSubmissionNotFoundException, ParseException, JOSEException {
        List<String> requestIds = new ArrayList<>();
        List<VCResult> vcResults = new ArrayList<>();
        requestIds.add("req123");
        vcResults.add(new VCResult("", VerificationStatus.SUCCESS));
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[\"{\\\"verifiableCredential\\\":{\\\"credential\\\":{}}}\"]}", new PresentationSubmissionDto("id", "dId", Arrays.asList(new DescriptorMapDto("id","format","path", new PathNestedDto("format","path")))));
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));

        when(presentationVerifier.verify(anyString())).thenReturn(new PresentationVerificationResult(VPVerificationStatus.VALID, vcResults));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId)).thenReturn(new AuthorizationRequestCreateResponse());
        try (MockedStatic<VerificationUtils> utilities = Mockito.mockStatic(VerificationUtils.class)) {

            utilities.when(() -> VerificationUtils.verifyEd25519Signature(any())).thenAnswer(invocation -> null);

            VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

            assertNotNull(resultDto);
            assertEquals(VPResultStatus.SUCCESS, resultDto.getVpResultStatus());
        }
    }

    @Test
    public void testGetVPResult_VPSubmissionNotFound() {
        List<String> requestIds = new ArrayList<>();
        requestIds.add("req123");
        String transactionId = "tx123";

        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(new ArrayList<>());

        assertThrows(VPSubmissionNotFoundException.class, () -> verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId));
    }

    @Test
    public void testGetVPResult_VerificationFailed() throws VPSubmissionNotFoundException {
        List<String> requestIds = new ArrayList<>();
        requestIds.add("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[\"{\\\"verifiableCredential\\\":{\\\"credential\\\":{}}}\"]}", new PresentationSubmissionDto("id", "dId", new ArrayList<>()));
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(presentationVerifier.verify(anyString())).thenReturn(new PresentationVerificationResult(VPVerificationStatus.INVALID, new ArrayList<>()));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId)).thenReturn(new AuthorizationRequestCreateResponse());

        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);

        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }

    @Test
    public void testGetVPResult_TokenMatchingFailed() throws VPSubmissionNotFoundException {
        List<String> requestIds = new ArrayList<>();
        requestIds.add("req123");
        String transactionId = "tx123";

        VPSubmission vpSubmission = new VPSubmission("state123", "{\"proof\":{\"type\":\"Ed25519Signature2018\"},\"verifiableCredential\":[]}", new PresentationSubmissionDto("id", "dId", new ArrayList<>()));
        when(vpSubmissionRepository.findAllById(requestIds)).thenReturn(List.of(vpSubmission));
        when(verifiablePresentationRequestService.getLatestAuthorizationRequestFor(transactionId)).thenReturn(new AuthorizationRequestCreateResponse());
        VPTokenResultDto resultDto = verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId);
        assertNotNull(resultDto);
        assertEquals(VPResultStatus.FAILED, resultDto.getVpResultStatus());
    }
}
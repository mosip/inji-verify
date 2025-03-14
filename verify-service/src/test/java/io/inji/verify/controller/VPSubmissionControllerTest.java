package io.inji.verify.controller;

import com.google.gson.Gson;
import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;
import io.inji.verify.dto.submission.PresentationSubmissionDto;
import io.inji.verify.dto.submission.VPSubmissionDto;
import io.inji.verify.enums.VPRequestStatus;
import io.inji.verify.services.VerifiablePresentationRequestService;
import io.inji.verify.services.VerifiablePresentationSubmissionService;
import io.inji.verify.shared.Constants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class VPSubmissionControllerTest {

    @Mock
    private VerifiablePresentationRequestService verifiablePresentationRequestService;

    @Mock
    private VerifiablePresentationSubmissionService verifiablePresentationSubmissionService;

    @Mock
    private Gson gson;

    @InjectMocks
    private VPSubmissionController vpSubmissionController;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(vpSubmissionController).build();
    }

//    @Test
//    public void testSubmitVP_Success() throws Exception {
//        String vpToken = "testToken";
//        String presentationSubmission = "{\"id\":\"testId\"}";
//        String state = "testState";
//
//        PresentationSubmissionDto presentationSubmissionDto = new PresentationSubmissionDto("id","dId",new ArrayList<>());
//
//        VPRequestStatusDto requestStatusDto = new VPRequestStatusDto(VPRequestStatus.ACTIVE);
//
//        when(gson.fromJson(presentationSubmission, PresentationSubmissionDto.class)).thenReturn(presentationSubmissionDto);
//        when(verifiablePresentationRequestService.getCurrentRequestStatus(state)).thenReturn(requestStatusDto);
//
//        mockMvc.perform(post(Constants.RESPONSE_SUBMISSION_URI_ROOT + Constants.RESPONSE_SUBMISSION_URI)
//                        .contentType(MediaType.APPLICATION_FORM_URLENCODED_VALUE)
//                        .param("vp_token", vpToken)
//                        .param("presentation_submission", presentationSubmission)
//                        .param("state", state))
//                .andExpect(status().isOk());
//
//        verify(verifiablePresentationSubmissionService, times(2)).submit(any(VPSubmissionDto.class));
//        verify(verifiablePresentationRequestService, times(1)).getCurrentRequestStatus(state);
//    }
//
//    @Test
//    public void testSubmitVP_NotFound() throws Exception {
//        String vpToken = "testToken";
//        String presentationSubmission = "{\"id\":\"testId\"}";
//        String state = "testState";
//
//        PresentationSubmissionDto presentationSubmissionDto = new PresentationSubmissionDto("testId","dId",new ArrayList<>());
//
//        when(gson.fromJson(presentationSubmission, PresentationSubmissionDto.class)).thenReturn(presentationSubmissionDto);
//        when(verifiablePresentationRequestService.getCurrentRequestStatus(state)).thenReturn(null);
//
//        mockMvc.perform(post(Constants.RESPONSE_SUBMISSION_URI_ROOT + Constants.RESPONSE_SUBMISSION_URI)
//                        .contentType(MediaType.APPLICATION_FORM_URLENCODED_VALUE)
//                        .param("vp_token", vpToken)
//                        .param("presentation_submission", presentationSubmission)
//                        .param("state", state))
//                .andExpect(status().isNotFound());
//
//        verify(verifiablePresentationSubmissionService, times(1)).submit(any(VPSubmissionDto.class));
//        verify(verifiablePresentationRequestService, times(1)).getCurrentRequestStatus(state);
//    }

    @Test
    public void testSubmitVP_MissingParams() throws Exception {
        mockMvc.perform(post(Constants.RESPONSE_SUBMISSION_URI_ROOT + Constants.RESPONSE_SUBMISSION_URI)
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED_VALUE))
                .andExpect(status().isBadRequest());
    }
}


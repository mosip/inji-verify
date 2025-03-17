package io.inji.verify.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.inji.verify.dto.core.ErrorDto;
import io.inji.verify.dto.submission.VPTokenResultDto;
import io.inji.verify.enums.ErrorCode;
import io.inji.verify.enums.VPResultStatus;
import io.inji.verify.exception.VPSubmissionNotFoundException;
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
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

public class VPResultControllerTest {

    @Mock
    private VerifiablePresentationRequestService verifiablePresentationRequestService;

    @Mock
    private VerifiablePresentationSubmissionService verifiablePresentationSubmissionService;

    @InjectMocks
    private VPResultController vpResultController;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(vpResultController).build();
    }

    @Test
    public void testGetVPResult_Success() throws Exception {
        String transactionId = "tx123";
        List<String> requestIds = new ArrayList<>();
        requestIds.add("req456");

        VPTokenResultDto resultDto = new VPTokenResultDto("tId", VPResultStatus.SUCCESS,new ArrayList<>());

        when(verifiablePresentationRequestService.getLatestRequestIdFor(transactionId)).thenReturn(requestIds);
        when(verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId)).thenReturn(resultDto);

        mockMvc.perform(get("/vp-result/{transactionId}", transactionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(resultDto)));

        verify(verifiablePresentationRequestService, times(1)).getLatestRequestIdFor(transactionId);
        verify(verifiablePresentationSubmissionService, times(1)).getVPResult(requestIds, transactionId);
    }

    @Test
    public void testGetVPResult_NotFound_RequestIdsEmpty() throws Exception {
        String transactionId = "tx789";
        List<String> requestIds = new ArrayList<>();

        when(verifiablePresentationRequestService.getLatestRequestIdFor(transactionId)).thenReturn(requestIds);

        mockMvc.perform(get("/vp-result/{transactionId}", transactionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().string(objectMapper.writeValueAsString(new ErrorDto(ErrorCode.ERR_100, Constants.ERR_100))));

        verify(verifiablePresentationRequestService, times(1)).getLatestRequestIdFor(transactionId);
        verify(verifiablePresentationSubmissionService, never()).getVPResult(any(), any());
    }

    @Test
    public void testGetVPResult_NotFound_VPSubmissionNotFound() throws Exception {
        String transactionId = "tx101";
        List<String> requestIds = new ArrayList<>();
        requestIds.add("req112");

        when(verifiablePresentationRequestService.getLatestRequestIdFor(transactionId)).thenReturn(requestIds);
        when(verifiablePresentationSubmissionService.getVPResult(requestIds, transactionId))
                .thenThrow(new VPSubmissionNotFoundException());

        mockMvc.perform(get("/vp-result/{transactionId}", transactionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().string(objectMapper.writeValueAsString(new ErrorDto(ErrorCode.ERR_101, Constants.ERR_101))));

        verify(verifiablePresentationRequestService, times(1)).getLatestRequestIdFor(transactionId);
        verify(verifiablePresentationSubmissionService, times(1)).getVPResult(requestIds, transactionId);
    }
}
package io.inji.verify.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.inji.verify.dto.authorizationrequest.VPRequestCreateDto;
import io.inji.verify.dto.authorizationrequest.VPRequestResponseDto;
import io.inji.verify.dto.authorizationrequest.VPRequestStatusDto;
import io.inji.verify.dto.core.ErrorDto;
import io.inji.verify.enums.ErrorCode;
import io.inji.verify.enums.VPRequestStatus;
import io.inji.verify.exception.PresentationDefinitionNotFoundException;
import io.inji.verify.services.VerifiablePresentationRequestService;
import io.inji.verify.shared.Constants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.request.async.DeferredResult;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

public class VPRequestControllerTest {

    @Mock
    private VerifiablePresentationRequestService verifiablePresentationRequestService;

    @InjectMocks
    private VPRequestController vpRequestController;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(vpRequestController).build();
    }

    @Test
    public void testCreateVPRequest_Success() throws Exception {
        VPRequestCreateDto createDto = new VPRequestCreateDto("cId","tId","pdId","nonce",mock());
        VPRequestResponseDto responseDto = new VPRequestResponseDto("tId","rId",mock(),0l);

        when(verifiablePresentationRequestService.createAuthorizationRequest(any())).thenReturn(responseDto);

        mockMvc.perform(post("/vp-request")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(content().json(objectMapper.writeValueAsString(responseDto)));

    }

    @Test
    public void testCreateVPRequest_BadRequest_NoDefinition() throws Exception {
        VPRequestCreateDto createDto = new VPRequestCreateDto("cId","tId",null,"nonce",null);


        mockMvc.perform(post("/vp-request")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().json(objectMapper.writeValueAsString(new ErrorDto(ErrorCode.ERR_200, Constants.ERR_200))));

        verify(verifiablePresentationRequestService, never()).createAuthorizationRequest(any());
    }

    @Test
    public void testCreateVPRequest_NotFound() throws Exception {
        VPRequestCreateDto createDto = new VPRequestCreateDto("cId","tId","pdId","nonce",mock());


        when(verifiablePresentationRequestService.createAuthorizationRequest(any()))
                .thenThrow(new PresentationDefinitionNotFoundException());

        mockMvc.perform(post("/vp-request")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isNotFound())
                .andExpect(content().json(objectMapper.writeValueAsString(new ErrorDto(ErrorCode.ERR_201, Constants.ERR_201))));
    }

    @Test
    public void testGetStatus() throws Exception {
        String requestId = "req789";
        VPRequestStatusDto statusDto = new VPRequestStatusDto(VPRequestStatus.ACTIVE);

        DeferredResult<VPRequestStatusDto> deferredResult = new DeferredResult<>();

        when(verifiablePresentationRequestService.getStatus(requestId)).thenReturn(deferredResult);

        MvcResult mvcResult = mockMvc.perform(get("/vp-request/{requestId}/status", requestId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        deferredResult.setResult(statusDto);
        Object result = mvcResult.getAsyncResult();
        assertEquals(new ObjectMapper().writeValueAsString(statusDto), new ObjectMapper().writeValueAsString(result));
        verify(verifiablePresentationRequestService, times(1)).getStatus(requestId);
    }
}
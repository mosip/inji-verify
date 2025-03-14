package io.inji.verify.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.inji.verify.dto.verification.VCVerificationStatusDto;
import io.inji.verify.enums.VerificationStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import io.inji.verify.services.VCVerificationService;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

public class VCVerificationControllerTest {

    @Mock
    private  VCVerificationService VCVerificationService;

    @InjectMocks
    private VCVerificationController VCVerificationController;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(VCVerificationController).build();
    }

    @Test
    public void testVerifyValidVC() throws Exception {
        String validVC = "validVC";
        VCVerificationStatusDto expectedStatus = new VCVerificationStatusDto(VerificationStatus.SUCCESS);

        when(VCVerificationService.verify(validVC)).thenReturn(expectedStatus);

        String result = mockMvc.perform(post("/vc-verification")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validVC))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        assertEquals(objectMapper.writeValueAsString(expectedStatus), result);

        verify(VCVerificationService, times(1)).verify(validVC);
    }

    @Test
    public void testVerifyInvalidVC() throws Exception {
        String invalidVC = "invalidVC";
        VCVerificationStatusDto expectedStatus = new VCVerificationStatusDto(VerificationStatus.INVALID);

        when(VCVerificationService.verify(invalidVC)).thenReturn(expectedStatus);

        mockMvc.perform(post("/vc-verification")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidVC))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(expectedStatus)));

        verify(VCVerificationService, times(1)).verify(invalidVC);
    }

    @Test
    public void testVerifyEmptyBody() throws Exception {
        mockMvc.perform(post("/vc-verification")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(""))
                .andExpect(status().isBadRequest());
    }
}
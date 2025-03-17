package io.inji.verify.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
import io.inji.verify.services.VPDefinitionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.junit.jupiter.api.Assertions.*;

public class VPDefinitionControllerTest {

    @Mock
    private VPDefinitionService vpDefinitionService;

    @InjectMocks
    private VPDefinitionController vpDefinitionController;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(vpDefinitionController).build();
    }

    @Test
    public void testGetPresentationDefinitionForFound() throws Exception {
        String id = "presentation123";
        VPDefinitionResponseDto expectedResponse = new VPDefinitionResponseDto(id,new ArrayList<>(),new ArrayList<>());

        when(vpDefinitionService.getPresentationDefinition(id)).thenReturn(expectedResponse);

        mockMvc.perform(get("/vp-definition/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(expectedResponse)));

        verify(vpDefinitionService, times(1)).getPresentationDefinition(id);
    }

    @Test
    public void testGetPresentationDefinitionForNotFound() throws Exception {
        String id = "presentation404";

        when(vpDefinitionService.getPresentationDefinition(id)).thenReturn(null);

        mockMvc.perform(get("/vp-definition/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().string(""));

        verify(vpDefinitionService, times(1)).getPresentationDefinition(id);
    }

    @Test
    public void testGetPresentationDefinitionForControllerLogicFound() {
        String id = "presentation123";
        VPDefinitionResponseDto expectedResponse = new VPDefinitionResponseDto(id,mock(),mock());
        when(vpDefinitionService.getPresentationDefinition(id)).thenReturn(expectedResponse);

        ResponseEntity<VPDefinitionResponseDto> responseEntity = vpDefinitionController.getPresentationDefinitionFor(id);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(expectedResponse, responseEntity.getBody());
    }

    @Test
    public void testGetPresentationDefinitionForControllerLogicNotFound() {
        String id = "presentation404";
        when(vpDefinitionService.getPresentationDefinition(id)).thenReturn(null);

        ResponseEntity<VPDefinitionResponseDto> responseEntity = vpDefinitionController.getPresentationDefinitionFor(id);

        assertEquals(HttpStatus.NOT_FOUND, responseEntity.getStatusCode());
        assertNull(responseEntity.getBody());
    }

}
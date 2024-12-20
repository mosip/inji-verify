package io.inji.verify.dto.authorizationrequest;

import io.inji.verify.dto.presentation.InputDescriptorDto;
import io.inji.verify.dto.presentation.PresentationDefinitionDto;
import io.inji.verify.dto.presentation.SubmissionRequirementDto;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

public class VPRequestCreateDtoTest {
    @Test
    public void testConstructor() {
        String clientId = "client123";
        String transactionId = "tx123";
        String presentationDefinitionId = "pd123";
        String nonce = "nonce123";
        List<InputDescriptorDto> mockInputDescriptors = mock();
        List<SubmissionRequirementDto> mockSubmissionRequirements = mock();
        PresentationDefinitionDto presentationDefinition = new PresentationDefinitionDto("pd123",mockInputDescriptors , mockSubmissionRequirements);

        VPRequestCreateDto vpRequestCreateDto = new VPRequestCreateDto(clientId, transactionId, presentationDefinitionId, nonce, presentationDefinition);

        assertEquals(clientId, vpRequestCreateDto.getClientId());
        assertEquals(transactionId, vpRequestCreateDto.getTransactionId());
        assertEquals(presentationDefinitionId, vpRequestCreateDto.getPresentationDefinitionId());
        assertEquals(nonce, vpRequestCreateDto.getNonce());
        assertEquals(presentationDefinition, vpRequestCreateDto.getPresentationDefinition());
    }
}
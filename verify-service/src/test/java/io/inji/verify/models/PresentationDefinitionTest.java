package io.inji.verify.models;

import io.inji.verify.dto.presentation.InputDescriptorDto;
import io.inji.verify.dto.presentation.SubmissionRequirementDto;
import io.inji.verify.shared.Constants;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
import java.util.List;

public class PresentationDefinitionTest {

    @Test
    public void testConstructorAndGetters() {
        String id = "presentation123";
        List<InputDescriptorDto> inputDescriptors = new ArrayList<>();
        List<SubmissionRequirementDto> submissionRequirements = new ArrayList<>();
        String name = "Test Presentation";
        String purpose = "For testing purposes";

        PresentationDefinition presentationDefinition = new PresentationDefinition(
                id, inputDescriptors, name, purpose, submissionRequirements);

        assertEquals(id, presentationDefinition.getId());
        assertEquals(inputDescriptors, presentationDefinition.getInputDescriptors());
        assertEquals(name, presentationDefinition.getName());
        assertEquals(purpose, presentationDefinition.getPurpose());
        assertEquals(submissionRequirements, presentationDefinition.getSubmissionRequirements());
    }

    @Test
    public void testGetURL() {
        String id = "presentation123";
        List<InputDescriptorDto> inputDescriptors = new ArrayList<>();
        List<SubmissionRequirementDto> submissionRequirements = new ArrayList<>();
        String name = "Test Presentation";
        String purpose = "For testing purposes";

        PresentationDefinition presentationDefinition = new PresentationDefinition(
                id, inputDescriptors, name, purpose, submissionRequirements);

        assertEquals(Constants.VP_DEFINITION_URI + id, presentationDefinition.getURL());
    }


    @Test
    public void testEmptyLists() {
        String id = "presentation123";
        PresentationDefinition presentationDefinition = new PresentationDefinition(
                id, new ArrayList<>(), "name", "purpose", new ArrayList<>());

        assertNotNull(presentationDefinition.getInputDescriptors());
        assertNotNull(presentationDefinition.getSubmissionRequirements());
        assertTrue(presentationDefinition.getInputDescriptors().isEmpty());
        assertTrue(presentationDefinition.getSubmissionRequirements().isEmpty());
    }

    @Test
    public void testNoArgConstructor() {

        PresentationDefinition presentationDefinition = new PresentationDefinition();

        assertNull(presentationDefinition.getName());
        assertNull(presentationDefinition.getId());
        assertNull(presentationDefinition.getPurpose());
        assertNull(presentationDefinition.getInputDescriptors());
        assertNull(presentationDefinition.getSubmissionRequirements());
    }

}
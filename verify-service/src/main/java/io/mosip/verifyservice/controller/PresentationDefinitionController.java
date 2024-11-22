package io.mosip.verifyservice.controller;

import io.mosip.verifycore.dto.presentation.PresentationDefinitionDto;
import io.mosip.verifycore.models.PresentationDefinition;
import io.mosip.verifycore.spi.PresentationDefinitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/vp-definition")
@RestController
public class PresentationDefinitionController {
    @Autowired
    PresentationDefinitionService presentationDefinitionService;

    @GetMapping(path = "/{id}")
    public ResponseEntity<PresentationDefinitionDto> getPresentationDefinitionFor(@PathVariable String id) {

        PresentationDefinition presentationDefinition = presentationDefinitionService.getPresentationDefinition(id);
        if (presentationDefinition != null)
        {
            return new ResponseEntity<>(new PresentationDefinitionDto(presentationDefinition.getId(),presentationDefinition.getInputDescriptors(),presentationDefinition.getSubmissionRequirements()), HttpStatus.OK);
        }

        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

    }
}

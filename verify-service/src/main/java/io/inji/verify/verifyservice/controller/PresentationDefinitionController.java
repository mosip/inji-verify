package io.inji.verify.verifyservice.controller;

import io.inji.verify.verifyservice.dto.presentation.PresentationDefinitionDto;
import io.inji.verify.verifyservice.spi.PresentationDefinitionService;
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

        PresentationDefinitionDto presentationDefinitionDto = presentationDefinitionService.getPresentationDefinition(id);
        if (presentationDefinitionDto != null)
        {
            return new ResponseEntity<>(presentationDefinitionDto, HttpStatus.OK);
        }

        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

    }
}

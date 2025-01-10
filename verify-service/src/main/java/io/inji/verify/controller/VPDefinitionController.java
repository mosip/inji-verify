package io.inji.verify.controller;

import io.inji.verify.dto.presentation.VPDefinitionResponseDto;
import io.inji.verify.spi.VPDefinitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/vp-definition")
@RestController
public class VPDefinitionController {
    @Autowired
    VPDefinitionService VPDefinitionService;

    @GetMapping(path = "/{id}")
    public ResponseEntity<VPDefinitionResponseDto> getPresentationDefinitionFor(@PathVariable String id) {

        VPDefinitionResponseDto VPDefinitionResponseDto = VPDefinitionService.getPresentationDefinition(id);
        if (VPDefinitionResponseDto != null)
        {
            return new ResponseEntity<>(VPDefinitionResponseDto, HttpStatus.OK);
        }

        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

    }
}
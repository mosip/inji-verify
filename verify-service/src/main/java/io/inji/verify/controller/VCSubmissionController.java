package io.inji.verify.controller;


import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import io.inji.verify.dto.submission.VCSubmissionResponseDto;
import io.inji.verify.services.VCSubmissionService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@Validated
@Slf4j
@CrossOrigin
public class VCSubmissionController {
    @Autowired
    private VCSubmissionService vcSubmissionService;

    @PostMapping(path = "vc-submission", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<VCSubmissionResponseDto> submitVC(@Valid @RequestBody JSONObject vc){
        return new ResponseEntity<>(vcSubmissionService.submitVC(vc), HttpStatus.OK);
    }

}

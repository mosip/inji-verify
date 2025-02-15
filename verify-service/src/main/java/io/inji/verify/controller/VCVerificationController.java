package io.inji.verify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.inji.verify.dto.verification.VCVerificationStatusDto;
import io.inji.verify.services.VCVerificationService;
import lombok.extern.slf4j.Slf4j;

@RequestMapping(path = "/vc-verification")
@RestController
@Slf4j
public class VCVerificationController {
    @Autowired
    VCVerificationService VCVerificationService;
    @PostMapping()
    public VCVerificationStatusDto verify(@RequestBody String vc) {
        return VCVerificationService.verify(vc);
    }
}
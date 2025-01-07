package io.inji.verify.controller;

import io.inji.verify.dto.verification.VCVerificationStatusDto;
import io.inji.verify.spi.VCVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping(path = "/vc-verification")
@RestController
public class VCVerificationController {
    @Autowired
    VCVerificationService VCVerificationService;
    @PostMapping()
    public VCVerificationStatusDto verify(@RequestBody String vc) {
        return VCVerificationService.verify(vc);
    }
}
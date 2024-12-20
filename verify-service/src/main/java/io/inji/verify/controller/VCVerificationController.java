package io.inji.verify.controller;

import lombok.extern.slf4j.Slf4j;
import io.inji.verify.dto.verification.VCVerificationStatusDto;
import io.inji.verify.spi.VCVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
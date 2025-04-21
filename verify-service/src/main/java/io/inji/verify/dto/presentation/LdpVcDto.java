package io.inji.verify.dto.presentation;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class LdpVcDto {
    private List<String> proofType;
}

package io.inji.verify.dto.presentation;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
@AllArgsConstructor
@Getter
public class JwtVcDto {
    private List<String> alg;
}

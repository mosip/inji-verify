package io.inji.verify.dto.presentation;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class FormatDto {
    private JwtDto jwt;
    private JwtVcDto jwt_vc;
    private LdpVcDto ldp_vc;
}

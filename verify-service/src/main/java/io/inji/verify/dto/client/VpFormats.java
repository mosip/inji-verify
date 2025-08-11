package io.inji.verify.dto.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nimbusds.jose.shaded.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class VpFormats {
    @JsonProperty("ldp_vp")
    @SerializedName("ldp_vp")
    private LdpVp ldpVp;
}
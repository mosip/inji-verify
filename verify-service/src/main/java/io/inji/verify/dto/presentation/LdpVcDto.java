package io.inji.verify.dto.presentation;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nimbusds.jose.shaded.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@Getter
@NoArgsConstructor
public class LdpVcDto {
    @JsonProperty("proof_type")
    @SerializedName("proof_type")
    private List<String> proofType;
}
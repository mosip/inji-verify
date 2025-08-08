package io.inji.verify.dto.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nimbusds.jose.shaded.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ClientMetadataDto {
    @JsonProperty("client_name")
    @SerializedName("client_name")
    String clientName;

    @JsonProperty("vp_formats")
    @SerializedName("vp_formats")
    VpFormats vpFormats;
}

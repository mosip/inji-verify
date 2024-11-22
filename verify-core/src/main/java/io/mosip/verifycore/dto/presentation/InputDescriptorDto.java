package io.mosip.verifycore.dto.presentation;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InputDescriptorDto {
    String id;
    String name;
    String purpose;
    List<String> group;
    Map<String, Map<String, List<String>>> format;
    ConstraintsDTO constraints;
}

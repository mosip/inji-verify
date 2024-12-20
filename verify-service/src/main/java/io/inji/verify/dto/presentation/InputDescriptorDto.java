package io.inji.verify.dto.presentation;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InputDescriptorDto {
    String id;
    String name;
    String purpose;
    List<String> group;
    Map<String, Map<String, List<String>>> format;
    ConstraintsDTO constraints;
}

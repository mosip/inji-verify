package io.mosip.verifycore.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mosip.verifycore.dto.presentation.InputDescriptorDto;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

//@Converter(autoApply = true)
public class LocalDateAttributeConverter implements AttributeConverter<List<InputDescriptorDto>, String> {

    @Override
    public String convertToDatabaseColumn(List<InputDescriptorDto> entityValue) {
        if( entityValue == null )
            return null;

        ObjectMapper mapper = new ObjectMapper();

        try {

            return mapper.writeValueAsString(entityValue);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<InputDescriptorDto> convertToEntityAttribute(String databaseValue) {
        if( databaseValue == null )
            return null;

        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY);

        try {

            return mapper.readValue(databaseValue,List.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

    }
}
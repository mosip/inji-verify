package io.inji.verify.singletons;

import com.nimbusds.jose.shaded.gson.Gson;
import org.springframework.stereotype.Component;

@Component
public class GsonSingleton {
    private final Gson gson = new Gson();

    public Gson getInstance() {
        return gson;
    }
}
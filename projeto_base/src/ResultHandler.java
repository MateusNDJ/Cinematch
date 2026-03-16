import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.*;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class ResultHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String query = exchange.getRequestURI().getQuery();
        Map<String, String> params = parseQuery(query);

        String person1 = params.getOrDefault("p1", "Pessoa 1");
        String person2 = params.getOrDefault("p2", "Pessoa 2");

        // Gêneros escolhidos por cada um (IDs da TMDB)
        String genres1 = params.getOrDefault("g1", "");
        String genres2 = params.getOrDefault("g2", "");

        // Calcula compatibilidade
        int compatibility = calculateCompatibility(genres1, genres2);

        // Busca filmes dos gêneros em comum
        String commonGenres = findCommonGenres(genres1, genres2);
        String moviesJson = commonGenres.isEmpty()
            ? MovieApiClient.fetchMoviesByGenre("28") // ação como fallback
            : MovieApiClient.fetchMoviesByGenre(commonGenres.split(",")[0]);

        String html = HtmlTemplates.getResultPage(person1, person2, compatibility, moviesJson, genres1, genres2);
        byte[] bytes = html.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "text/html; charset=UTF-8");
        exchange.sendResponseHeaders(200, bytes.length);
        exchange.getResponseBody().write(bytes);
        exchange.getResponseBody().close();
    }

    private int calculateCompatibility(String g1, String g2) {
        if (g1.isEmpty() || g2.isEmpty()) return 50;
        Set<String> set1 = new HashSet<>(Arrays.asList(g1.split(",")));
        Set<String> set2 = new HashSet<>(Arrays.asList(g2.split(",")));
        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);
        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);
        if (union.isEmpty()) return 50;
        // Cálculo real: Jaccard Index (interseção / união) * 100
        return (int) ((double) intersection.size() / union.size() * 100);
    }

    private String findCommonGenres(String g1, String g2) {
        if (g1.isEmpty() || g2.isEmpty()) return "";
        Set<String> set1 = new HashSet<>(Arrays.asList(g1.split(",")));
        Set<String> set2 = new HashSet<>(Arrays.asList(g2.split(",")));
        set1.retainAll(set2);
        return String.join(",", set1);
    }

    private Map<String, String> parseQuery(String query) {
        Map<String, String> map = new HashMap<>();
        if (query == null) return map;
        for (String pair : query.split("&")) {
            String[] kv = pair.split("=", 2);
            if (kv.length == 2) {
                try {
                    map.put(kv[0], java.net.URLDecoder.decode(kv[1], "UTF-8"));
                } catch (Exception e) {
                    map.put(kv[0], kv[1]);
                }
            }
        }
        return map;
    }
}

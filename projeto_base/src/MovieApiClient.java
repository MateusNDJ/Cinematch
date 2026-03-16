import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class MovieApiClient implements HttpHandler {

    // Chave gratuita da TMDB - substitua pela sua em https://www.themoviedb.org/settings/api
    private static final String API_KEY = "8265bd1679663a7ea12ac168da84d2e8";
    private static final String BASE_URL = "https://api.themoviedb.org/3";

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String query = exchange.getRequestURI().getQuery();
        String genre = "";
        if (query != null && query.contains("genre=")) {
            genre = query.split("genre=")[1].split("&")[0];
        }

        String json = fetchMoviesByGenre(genre);
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.sendResponseHeaders(200, bytes.length);
        exchange.getResponseBody().write(bytes);
        exchange.getResponseBody().close();
    }

    public static String fetchMoviesByGenre(String genreId) {
        try {
            String urlStr = BASE_URL + "/discover/movie?api_key=" + API_KEY
                    + "&language=pt-BR&sort_by=popularity.desc&with_genres=" + genreId
                    + "&page=1";
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            BufferedReader reader = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
            reader.close();
            return sb.toString();
        } catch (Exception e) {
            return "{\"results\":[]}";
        }
    }

    public static String fetchMovieDetails(String movieId) {
        try {
            String urlStr = BASE_URL + "/movie/" + movieId + "?api_key=" + API_KEY + "&language=pt-BR";
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            BufferedReader reader = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
            reader.close();
            return sb.toString();
        } catch (Exception e) {
            return "{}";
        }
    }
}

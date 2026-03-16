import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/", new WelcomeHandler());
        server.createContext("/quiz", new QuizHandler());
        server.createContext("/result", new ResultHandler());
        server.createContext("/api/movies", new MovieApiClient());
        server.createContext("/img/", new StaticFileHandler());
        server.setExecutor(null);
        System.out.println("===========================================");
        System.out.println("  CineMatch - Quiz de Casal");
        System.out.println("  Acesse: http://localhost:8080");
        System.out.println("  Working Directory: " + System.getProperty("user.dir"));
        System.out.println("===========================================");
        server.start();
    }
}

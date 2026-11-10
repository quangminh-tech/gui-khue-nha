import vn.nhipviec.mobile.MobileSessionExchange;
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
public class MobileSessionExchangeTest {
 public static void main(String[] args)throws Exception {
  HttpServer server=HttpServer.create(new InetSocketAddress("127.0.0.1",0),0);final int[] mode={200};final boolean[] followed={false};String cookie="kn_session="+"s".repeat(43)+"; Path=/; HttpOnly; SameSite=Lax; Secure";
  server.createContext("/auth/mobile/redeem",e->{e.getRequestBody().readAllBytes();if(mode[0]==200||mode[0]==303)e.getResponseHeaders().set("Set-Cookie",cookie);e.getResponseHeaders().set("Location","/must-not-follow");e.sendResponseHeaders(mode[0],-1);e.close();});server.createContext("/must-not-follow",e->{followed[0]=true;e.sendResponseHeaders(500,-1);e.close();});server.start();
  try {String origin="http://127.0.0.1:"+server.getAddress().getPort();if(!cookie.equals(MobileSessionExchange.exchange(origin,"c".repeat(43),"v".repeat(43))))throw new AssertionError("Cookie");mode[0]=303;MobileSessionExchange.exchange(origin,"c".repeat(43),"v".repeat(43));if(followed[0])throw new AssertionError("Followed redirect");mode[0]=401;try{MobileSessionExchange.exchange(origin,"c".repeat(43),"v".repeat(43));throw new AssertionError("Expired accepted");}catch(MobileSessionExchange.AuthExpiredException expected){}System.out.println("PASS native HTTP exchange: JSON/legacy cookie, no redirect following, expired response.");}finally{server.stop(0);}
 }
}

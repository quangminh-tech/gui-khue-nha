package vn.nhipviec.mobile;
import java.net.*;import java.io.*;import java.nio.charset.StandardCharsets;import java.util.*;
/** No redirects, no Google tokens, no session credentials in URLs or logs. */
public final class MobileSessionExchange {
 public static String exchange(String origin,String code,String verifier)throws IOException {
  HttpURLConnection c=(HttpURLConnection)new URL(origin+"/auth/mobile/redeem").openConnection();try{c.setInstanceFollowRedirects(false);c.setConnectTimeout(15000);c.setReadTimeout(65000);c.setRequestMethod("POST");c.setDoOutput(true);c.setRequestProperty("Accept","application/json");c.setRequestProperty("Content-Type","application/x-www-form-urlencoded");byte[] body=("code="+URLEncoder.encode(code,"UTF-8")+"&verifier="+URLEncoder.encode(verifier,"UTF-8")).getBytes(StandardCharsets.UTF_8);c.setFixedLengthStreamingMode(body.length);try(OutputStream out=c.getOutputStream()){out.write(body);}int status=c.getResponseCode();
   if(status==401||status==400)throw new AuthExpiredException();if(status!=200&&status!=303)throw new IOException("Session endpoint HTTP "+status);
   for(Map.Entry<String,List<String>> h:c.getHeaderFields().entrySet())if("Set-Cookie".equalsIgnoreCase(h.getKey()))for(String value:h.getValue())if(value.matches("kn_session=[A-Za-z0-9_-]{43};.*")&&value.contains("HttpOnly")&&value.contains("Secure"))return value;
   throw new IOException("No secure app session cookie");
  }finally{c.disconnect();}
 }
 public static class AuthExpiredException extends IOException {}
}

import vn.nhipviec.mobile.ServerAddress;
public class ServerAddressTest {
 public static void main(String[] args)throws Exception {
  if(!ServerAddress.normalize(" https://GUI-NHA.onrender.com/ ").equals("https://gui-nha.onrender.com"))throw new AssertionError("normalization");
  if(!ServerAddress.normalize("https://example.com:443").equals("https://example.com"))throw new AssertionError("port");
  for(String value:new String[]{"http://example.com","https://user:secret@example.com","https://example.com/secret","https://example.com?token=x","https://example.com#x","https://example.com:3000","javascript:alert(1)","https://bad_host"}){
   boolean rejected=false;try{ServerAddress.normalize(value);}catch(Exception expected){rejected=true;}if(!rejected)throw new AssertionError("Accepted unsafe origin");
  }
  System.out.println("PASS Android HTTPS server address validation.");
 }
}

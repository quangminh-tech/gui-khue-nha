package vn.nhipviec.mobile;
import java.net.URI;
import java.util.Locale;
/** Only an HTTPS origin; never credentials, deep paths or query-string tokens. */
public final class ServerAddress {
 public static final String DEFAULT_ORIGIN="https://gui-khue-nha.onrender.com";
 public static String normalize(String raw)throws Exception {
  URI u=new URI(raw.trim());String host=u.getHost(),path=u.getPath();
  if(!"https".equalsIgnoreCase(u.getScheme())||host==null||host.isEmpty()||u.getUserInfo()!=null||u.getQuery()!=null||u.getFragment()!=null||(u.getPort()!=-1&&u.getPort()!=443)||(path!=null&&!path.isEmpty()&&!"/".equals(path)))throw new Exception("Nhập địa chỉ gốc HTTPS, ví dụ https://ten-app.onrender.com; không thêm đường dẫn, mật khẩu hay tham số.");
  return "https://"+host.toLowerCase(Locale.ROOT);
 }
}

package vn.nhipviec.mobile;
import android.content.Context;
import android.content.SharedPreferences;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.HashSet;
public final class ReminderStore {
 public static String alarmKey(JSONObject t){return t.optLong("dueAt")+":"+t.optInt("reminder",15);}
 static final String PREFS="khue_nha_reminders_v1";
 public static JSONObject load(Context c){try{return new JSONObject(c.getSharedPreferences(PREFS,0).getString("snapshot","{}"));}catch(Exception e){return new JSONObject();}}
 public static JSONObject validate(String raw)throws Exception{
  if(raw==null||raw.length()>30000)throw new Exception("Bản nhắc quá lớn hoặc bị thiếu.");
  JSONObject value=new JSONObject(raw);if(value.optInt("version")!=1)throw new Exception("Phiên bản bản nhắc không được hỗ trợ.");
  JSONArray tasks=value.getJSONArray("tasks");if(tasks.length()>30)throw new Exception("Tối đa 30 việc trong một lần gửi.");
  String owner=value.optString("owner","");if(owner.isEmpty()||owner.length()>80)throw new Exception("Tên sổ tay không hợp lệ.");
  HashSet<String> ids=new HashSet<>();for(int i=0;i<tasks.length();i++){JSONObject t=tasks.getJSONObject(i);String id=t.getString("id"),title=t.getString("title");if(!id.matches("[A-Za-z0-9_-]{1,100}")||!ids.add(id)||title.isEmpty()||title.length()>120)throw new Exception("Thông tin công việc không hợp lệ.");long due=t.getLong("dueAt");if(due<0||due>System.currentTimeMillis()+3660L*86400000L)throw new Exception("Deadline không hợp lệ.");int reminder=t.optInt("reminder",15),progress=t.optInt("progress",0);if(reminder<0||reminder>10080||progress<0||progress>100)throw new Exception("Tiến độ hoặc giờ nhắc không hợp lệ.");}
  if(!value.optString("quietStart","22:00").matches("(?:[01][0-9]|2[0-3]):[0-5][0-9]")||!value.optString("quietEnd","07:00").matches("(?:[01][0-9]|2[0-3]):[0-5][0-9]"))throw new Exception("Giờ yên lặng không hợp lệ.");
  return value;
 }
 public static boolean save(Context c,JSONObject data){return c.getSharedPreferences(PREFS,0).edit().putString("snapshot",data.toString()).commit();}
 public static void clear(Context c){c.getSharedPreferences(PREFS,0).edit().clear().apply();}
 public static JSONObject task(Context c,String id){JSONArray list=load(c).optJSONArray("tasks");if(list!=null)for(int i=0;i<list.length();i++){JSONObject t=list.optJSONObject(i);if(t!=null&&id.equals(t.optString("id")))return t;}return null;}
 public static int color(JSONObject data){switch(data.optString("character","zhongli")){case "mavuika":return 0xffeda173;case "columbina":return 0xffc2b8f0;case "tsaritsa":return 0xffa6dced;case "rhinedottir":return 0xffe5ce91;case "raiden":return 0xffb7a0eb;case "venti":return 0xff8ccdbb;case "nahida":return 0xffb7cf88;case "furina":return 0xff93bfec;default:return 0xffe6bd6a;}}
 public static String region(JSONObject data){switch(data.optString("character","zhongli")){case "mavuika":return "Natlan · Hỏa";case "columbina":return "Nod-Krai · Nguyệt";case "tsaritsa":return "Snezhnaya · Băng";case "rhinedottir":return "Giả kim · Sự sống";case "raiden":return "Inazuma · Lôi";case "venti":return "Mondstadt · Phong";case "nahida":return "Sumeru · Thảo";case "furina":return "Fontaine · Thủy";case "paimon":return "Teyvat · Hành trình";default:return "Liyue · Nham";}}
}

package vn.nhipviec.mobile;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import org.json.JSONArray;
import org.json.JSONObject;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
public final class ReminderScheduler {
 static PendingIntent pending(Context c,String id){Intent intent=new Intent(c,ReminderReceiver.class).setAction("vn.nhipviec.REMIND").setData(Uri.parse("guikhuenha://alarm/"+Uri.encode(id))).putExtra("task_id",id);return PendingIntent.getBroadcast(c,id.hashCode(),intent,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);}
 public static boolean quiet(JSONObject data,long time){String start=data.optString("quietStart","22:00"),end=data.optString("quietEnd","07:00");if(start.equals(end))return false;SimpleDateFormat f=new SimpleDateFormat("HH:mm",Locale.US);f.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));String clock=f.format(new Date(time));return start.compareTo(end)<0?clock.compareTo(start)>=0&&clock.compareTo(end)<0:clock.compareTo(start)>=0||clock.compareTo(end)<0;}
 public static void cancel(Context c){JSONArray list=ReminderStore.load(c).optJSONArray("tasks");if(list==null)return;AlarmManager manager=(AlarmManager)c.getSystemService(Context.ALARM_SERVICE);for(int i=0;i<list.length();i++){JSONObject t=list.optJSONObject(i);if(t!=null)manager.cancel(pending(c,t.optString("id")));}}
 public static void schedule(Context c){JSONObject data=ReminderStore.load(c);JSONArray tasks=data.optJSONArray("tasks");if(tasks==null)return;for(int i=0;i<tasks.length();i++){JSONObject t=tasks.optJSONObject(i);if(t==null||t.optInt("reminder",15)==0)continue;long trigger=t.optLong("dueAt")-t.optInt("reminder",15)*60000L;if(trigger>System.currentTimeMillis())scheduleOne(c,t.optString("id"),trigger);}}
 public static void scheduleOne(Context c,String id,long trigger){if(quiet(ReminderStore.load(c),trigger))return;AlarmManager manager=(AlarmManager)c.getSystemService(Context.ALARM_SERVICE);manager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,trigger,pending(c,id));}
}

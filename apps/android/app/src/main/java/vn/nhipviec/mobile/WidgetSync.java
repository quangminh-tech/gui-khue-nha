package vn.nhipviec.mobile;
import android.content.Context;
import android.app.job.*;
import android.content.ComponentName;
import android.webkit.CookieManager;
import org.json.JSONObject;
import java.net.*;
import java.io.*;
public final class WidgetSync {
 private static boolean running=false;
 public static String origin(Context c){return c.getSharedPreferences("khue_nha_server",0).getString("origin",ServerAddress.DEFAULT_ORIGIN);}
 public static void capture(Context c){String value=CookieManager.getInstance().getCookie(origin(c)),session="";if(value!=null)for(String part:value.split(";"))if(part.trim().startsWith("kn_session="))session=part.trim();c.getSharedPreferences("kn_widget_auth",0).edit().putString("cookie",session).apply();if(session.isEmpty()){clear(c);return;}schedule(c);refresh(c,null);}
 public static void clear(Context c){c.getSharedPreferences("kn_widget_auth",0).edit().clear().apply();((JobScheduler)c.getSystemService(Context.JOB_SCHEDULER_SERVICE)).cancel(1701);ReminderScheduler.cancel(c);ReminderStore.clear(c);TaskWidget.updateAll(c);}
 public static void schedule(Context c){if(c.getSharedPreferences("kn_widget_auth",0).getString("cookie","").isEmpty())return;((JobScheduler)c.getSystemService(Context.JOB_SCHEDULER_SERVICE)).schedule(new JobInfo.Builder(1701,new ComponentName(c,WidgetSyncJob.class)).setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY).setPeriodic(15*60*1000L).setPersisted(true).build());}
 public static void refresh(Context c,Runnable finished){final Context context=c.getApplicationContext();synchronized(WidgetSync.class){if(running){if(finished!=null)finished.run();return;}running=true;}final String server=origin(context),cookie=context.getSharedPreferences("kn_widget_auth",0).getString("cookie","");new Thread(()->{HttpURLConnection connection=null;try{if(cookie.isEmpty())return;connection=(HttpURLConnection)new URL(server+"/api/android/snapshot").openConnection();connection.setConnectTimeout(15000);connection.setReadTimeout(65000);connection.setInstanceFollowRedirects(false);connection.setRequestProperty("Cookie",cookie);connection.setRequestProperty("Accept","application/json");int code=connection.getResponseCode();if(!server.equals(origin(context))||!cookie.equals(context.getSharedPreferences("kn_widget_auth",0).getString("cookie","")))return;if(code==401){clear(context);return;}if(code!=200)return;ByteArrayOutputStream bytes=new ByteArrayOutputStream();try(InputStream in=connection.getInputStream()){byte[] chunk=new byte[2048];int n;while((n=in.read(chunk))!=-1){if(bytes.size()+n>30000)return;bytes.write(chunk,0,n);}}JSONObject snapshot=ReminderStore.validate(bytes.toString("UTF-8"));synchronized(WidgetSync.class){if(!server.equals(origin(context))||!cookie.equals(context.getSharedPreferences("kn_widget_auth",0).getString("cookie","")))return;ReminderScheduler.cancel(context);if(ReminderStore.save(context,snapshot)){ReminderScheduler.schedule(context);TaskWidget.updateAll(context);}}}catch(Exception ignored){}finally{if(connection!=null)connection.disconnect();synchronized(WidgetSync.class){running=false;}if(finished!=null)finished.run();}}).start();}
}

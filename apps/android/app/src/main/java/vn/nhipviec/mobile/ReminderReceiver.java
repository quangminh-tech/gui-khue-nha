package vn.nhipviec.mobile;
import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;
import org.json.JSONObject;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
public class ReminderReceiver extends BroadcastReceiver {
 @Override public void onReceive(Context context,Intent intent){String id=intent.getStringExtra("task_id");JSONObject task=ReminderStore.task(context,id);if(task==null)return;NotificationManager manager=(NotificationManager)context.getSystemService(Context.NOTIFICATION_SERVICE);if("vn.nhipviec.SNOOZE".equals(intent.getAction())){ReminderScheduler.scheduleOne(context,id,System.currentTimeMillis()+300000L);manager.cancel(id.hashCode());return;}
  JSONObject data=ReminderStore.load(context);if(ReminderScheduler.quiet(data,System.currentTimeMillis()))return;if(Build.VERSION.SDK_INT>=33&&context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED)return;
  String sound=data.optBoolean("sound",true)&&data.optInt("volume",45)>0?data.optString("ringtone","crystal"):"silent";if(!sound.equals("crystal")&&!sound.equals("lyre")&&!sound.equals("stars"))sound="silent";String channelId="kn_reminders_"+sound;Uri uri=sound.equals("silent")?null:Uri.parse("android.resource://"+context.getPackageName()+"/raw/"+sound);
  if(Build.VERSION.SDK_INT>=26){NotificationChannel channel=new NotificationChannel(channelId,"Nhắc việc · "+sound,NotificationManager.IMPORTANCE_HIGH);channel.enableVibration(true);channel.setDescription("Nhắc từ bản việc bạn gửi sang Android. Giờ có thể lệch do chế độ tiết kiệm pin.");channel.setSound(uri,new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_NOTIFICATION).setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build());manager.createNotificationChannel(channel);}
  Intent open=new Intent(context,MainActivity.class).setAction("vn.nhipviec.OPEN_TASK").putExtra("open_task",id).setData(Uri.parse("guikhuenha://open/"+Uri.encode(id)));PendingIntent content=PendingIntent.getActivity(context,id.hashCode(),open,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
  Intent snooze=new Intent(context,ReminderReceiver.class).setAction("vn.nhipviec.SNOOZE").putExtra("task_id",id).setData(Uri.parse("guikhuenha://snooze/"+Uri.encode(id)));PendingIntent snoozeAction=PendingIntent.getBroadcast(context,id.hashCode(),snooze,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
  SimpleDateFormat format=new SimpleDateFormat("dd/MM HH:mm",Locale.getDefault());format.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));String subtitle=ReminderStore.region(data)+" · "+format.format(new Date(task.optLong("dueAt")));
  Notification.Builder builder=Build.VERSION.SDK_INT>=26?new Notification.Builder(context,channelId):new Notification.Builder(context);builder.setSmallIcon(R.drawable.ic_nhipviec).setContentTitle(task.optString("title")).setContentText(subtitle).setStyle(new Notification.BigTextStyle().bigText(subtitle+"\nTiến độ "+task.optInt("progress")+"% · Mở app để cập nhật." )).setContentIntent(content).setAutoCancel(true).setCategory(Notification.CATEGORY_REMINDER).setColor(ReminderStore.color(data)).setVisibility(Notification.VISIBILITY_PRIVATE).setPriority(Notification.PRIORITY_HIGH).addAction(new Notification.Action.Builder(R.drawable.ic_nhipviec,"5 phút nữa",snoozeAction).build());
  if(Build.VERSION.SDK_INT<26)builder.setSound(uri).setVibrate(new long[]{0,120,80,120});try{manager.notify(id.hashCode(),builder.build());}catch(SecurityException ignored){}TaskWidget.updateAll(context);
 }
}

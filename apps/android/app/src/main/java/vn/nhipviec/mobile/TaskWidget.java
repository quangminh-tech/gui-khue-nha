package vn.nhipviec.mobile;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;
import android.os.Bundle;
import android.view.View;
import org.json.JSONArray;
import org.json.JSONObject;
import java.text.SimpleDateFormat;
import java.util.Locale;
import java.util.TimeZone;
import java.util.Date;
public class TaskWidget extends AppWidgetProvider {
 @Override public void onUpdate(Context c,AppWidgetManager manager,int[] ids){for(int id:ids)update(c,manager,id);}
 @Override public void onAppWidgetOptionsChanged(Context c,AppWidgetManager m,int id,Bundle options){update(c,m,id);}
 public static void updateAll(Context c){AppWidgetManager m=AppWidgetManager.getInstance(c);for(int id:m.getAppWidgetIds(new ComponentName(c,TaskWidget.class)))update(c,m,id);}
 static void update(Context c,AppWidgetManager manager,int widgetId){JSONObject data=ReminderStore.load(c);RemoteViews views=new RemoteViews(c.getPackageName(),R.layout.task_widget);views.setTextViewText(R.id.widget_title,"Sổ tay của "+data.optString("owner","bạn"));views.setTextViewText(R.id.widget_region,"◈ "+ReminderStore.region(data));views.setTextColor(R.id.widget_region,ReminderStore.color(data));views.setTextViewText(R.id.widget_progress,data.optInt("progress")+"% tiến độ");views.setProgressBar(R.id.widget_bar,100,data.optInt("progress"),false);JSONArray tasks=data.optJSONArray("tasks");int[] rows={R.id.widget_task1,R.id.widget_task2,R.id.widget_task3};SimpleDateFormat f=new SimpleDateFormat("dd/MM HH:mm",Locale.getDefault());f.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));for(int i=0;i<rows.length;i++){JSONObject t=tasks==null?null:tasks.optJSONObject(i);views.setTextViewText(rows[i],t==null?(i==0?"Gửi danh sách việc từ app để hiển thị.":""):"• "+t.optString("title")+"  ·  "+t.optInt("progress")+"%\n  "+f.format(new Date(t.optLong("dueAt"))));}
  int height=manager.getAppWidgetOptions(widgetId).getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT,230);views.setViewVisibility(R.id.widget_task3,height<220?View.GONE:View.VISIBLE);views.setViewVisibility(R.id.widget_task2,height<180?View.GONE:View.VISIBLE);
  String stamp=data.optString("syncedAt","");views.setTextViewText(R.id.widget_sync,stamp.isEmpty()?"Bản chụp thủ công · chưa có dữ liệu":"Bản chụp thủ công · mở app để gửi lại");Intent open=new Intent(c,MainActivity.class);PendingIntent action=PendingIntent.getActivity(c,0,open,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);views.setOnClickPendingIntent(R.id.widget_root,action);manager.updateAppWidget(widgetId,views);
 }
}

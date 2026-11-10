package vn.nhipviec.mobile;
import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.appwidget.AppWidgetManager;
import android.os.Build;
import android.os.Bundle;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.graphics.Color;
import android.view.Gravity;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.EditText;
import android.widget.ScrollView;
import android.text.InputType;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.browser.customtabs.CustomTabsIntent;
import org.json.JSONObject;
/** Online app with explicitly imported local reminder snapshots, never a WebView OAuth bridge. */
public class MainActivity extends Activity {
 private String serverUrl(){return getSharedPreferences("khue_nha_server",0).getString("origin","");}
 private String normalizeOrigin(String raw)throws Exception{return ServerAddress.normalize(raw);}
 private void configureServer(){EditText input=new EditText(this);input.setSingleLine(true);input.setInputType(InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_VARIATION_URI);input.setHint("https://ten-app.onrender.com");input.setText(serverUrl());LinearLayout box=new LinearLayout(this);box.setPadding(35,12,35,0);box.addView(input,new LinearLayout.LayoutParams(-1,-2));AlertDialog dialog=new AlertDialog.Builder(this).setTitle("Máy chủ của bạn").setMessage("Dán URL Render đã deploy. Khi đổi máy chủ, bản nhắc trên điện thoại sẽ được xóa để tránh nhầm dữ liệu.").setView(box).setPositiveButton("Lưu địa chỉ",null).setNegativeButton("Hủy",null).create();dialog.setOnShowListener(v->dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(w->{try{String next=normalizeOrigin(input.getText().toString());if(!next.equals(serverUrl())){ReminderScheduler.cancel(this);ReminderStore.clear(this);((android.app.NotificationManager)getSystemService(NOTIFICATION_SERVICE)).cancelAll();getSharedPreferences("khue_nha_server",0).edit().putString("origin",next).apply();TaskWidget.updateAll(this);}dialog.dismiss();render();toast("Đã lưu địa chỉ. Mở sổ tay để đăng nhập Google.");}catch(Exception e){input.setError(e.getMessage());}}));dialog.show();}
 @Override public void onCreate(Bundle state){super.onCreate(state);render();handle(getIntent());}
 @Override protected void onResume(){super.onResume();ReminderScheduler.schedule(this);TaskWidget.updateAll(this);}
 @Override protected void onNewIntent(Intent intent){super.onNewIntent(intent);setIntent(intent);handle(intent);}
 private void render(){LinearLayout layout=new LinearLayout(this);layout.setOrientation(LinearLayout.VERTICAL);layout.setGravity(Gravity.CENTER);layout.setPadding(32,48,32,48);layout.setBackgroundColor(Color.rgb(23,32,40));
 ImageView logo=new ImageView(this);logo.setImageResource(R.drawable.brand_logo);logo.setContentDescription("Logo Gửi Khuê Nhã");logo.setScaleType(ImageView.ScaleType.CENTER_CROP);int logoSize=(int)(96*getResources().getDisplayMetrics().density);LinearLayout.LayoutParams logoParams=new LinearLayout.LayoutParams(logoSize,logoSize);logoParams.gravity=Gravity.CENTER;logoParams.bottomMargin=20;layout.addView(logo,logoParams);
 TextView title=new TextView(this);title.setText("Gửi Khuê Nhã ◈");title.setTextSize(28);title.setTextColor(0xffefd3a0);title.setGravity(Gravity.CENTER);layout.addView(title);
 TextView note=new TextView(this);note.setText("Sổ tay cá nhân · Region Edition\n\nNhập địa chỉ Render của bạn, rồi mở sổ tay để đăng nhập Google. Trong Cài đặt, chọn Gửi việc sang bản Android để cập nhật widget và nhắc lịch trên máy này.");note.setTextSize(14);note.setTextColor(0xffc2cdd3);note.setGravity(Gravity.CENTER);note.setPadding(0,25,0,25);layout.addView(note);
 TextView serverLabel=new TextView(this);serverLabel.setText(serverUrl().isEmpty()?"Chưa cấu hình máy chủ":"Máy chủ: "+serverUrl());serverLabel.setTextSize(12);serverLabel.setTextColor(0xffd9c596);serverLabel.setGravity(Gravity.CENTER);layout.addView(serverLabel);addButton(layout,"Nhập / đổi địa chỉ Render",()->configureServer());
 addButton(layout,"Kết nối Google",()->openPath("/auth/google?next=connect"));addButton(layout,"Mở sổ tay cá nhân",()->openSite(null));addButton(layout,"Bật quyền thông báo",()->permission());addButton(layout,"Ghim widget màn hình chính",()->pinWidget());addButton(layout,"Xóa bản nhắc trên máy này",()->new AlertDialog.Builder(this).setTitle("Xóa bản nhắc trên điện thoại?").setMessage("Xóa snapshot, hủy các giờ nhắc đã đặt trên máy. Dữ liệu trực tuyến không thay đổi.").setPositiveButton("Xóa bản nhắc",(d,w)->{ReminderScheduler.cancel(this);ReminderStore.clear(this);((android.app.NotificationManager)getSystemService(NOTIFICATION_SERVICE)).cancelAll();TaskWidget.updateAll(this);toast("Đã xóa bản nhắc trên máy.");}).setNegativeButton("Hủy",null).show());
 TextView state=new TextView(this);JSONObject data=ReminderStore.load(this);state.setText(data.optJSONArray("tasks")!=null?"Bản nhắc của "+data.optString("owner")+" · "+data.optJSONArray("tasks").length()+" việc\nCần gửi lại sau khi sửa hoặc hoàn thành việc. Giờ nhắc có thể trễ do tiết kiệm pin. Âm lượng theo cài đặt thông báo của Android.":"Chưa nhận bản việc. Không cần mật khẩu MongoDB hay API key trên Android.");state.setTextColor(0xff98aebc);state.setTextSize(11);state.setGravity(Gravity.CENTER);state.setPadding(0,22,0,0);layout.addView(state);ScrollView scroll=new ScrollView(this);scroll.setFillViewport(true);scroll.addView(layout);setContentView(scroll);}
 private void addButton(LinearLayout layout,String text,Runnable action){Button button=new Button(this);button.setText(text);button.setOnClickListener(v->action.run());layout.addView(button);}
 private void handle(Intent intent){if(intent==null)return;String task=intent.getStringExtra("open_task");if(task!=null){openSite(task);intent.removeExtra("open_task");return;}Uri uri=intent.getData();if(uri==null||!"guikhuenha".equals(uri.getScheme())||!"reminders".equals(uri.getHost()))return;intent.setData(null);try{JSONObject snapshot=ReminderStore.validate(uri.getQueryParameter("data"));int count=snapshot.getJSONArray("tasks").length();new AlertDialog.Builder(this).setTitle("Nhận bản nhắc công việc?").setMessage("Sổ tay: "+snapshot.optString("owner")+"\n"+count+" việc, kèm deadline và %.\nThay bản nhắc cũ trên máy này. Không tự thay đổi dữ liệu trên web.").setPositiveButton("Nhận & đặt giờ nhắc",(d,w)->{ReminderScheduler.cancel(this);((android.app.NotificationManager)getSystemService(NOTIFICATION_SERVICE)).cancelAll();if(ReminderStore.save(this,snapshot)){ReminderScheduler.schedule(this);TaskWidget.updateAll(this);render();permission();toast("Đã nhận bản nhắc. Gửi lại sau khi sửa công việc.");}else toast("Không lưu được bản nhắc.");}).setNegativeButton("Hủy",null).show();}catch(Exception e){toast("Không nhận được bản nhắc: "+e.getMessage());}}
 private void permission(){if(Build.VERSION.SDK_INT>=33&&checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED)requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS},33);else toast("Quyền thông báo đã sẵn sàng. Kiểm tra thêm âm thanh/kênh thông báo trong cài đặt Android.");}
 private void pinWidget(){if(Build.VERSION.SDK_INT>=26){AppWidgetManager manager=getSystemService(AppWidgetManager.class);if(manager.isRequestPinAppWidgetSupported()){manager.requestPinAppWidget(new ComponentName(this,TaskWidget.class),null,null);return;}}toast("Nhấn giữ màn hình chính → Tiện ích → Gửi Khuê Nhã để thêm widget.");}
 private void openSite(String task){openPath(task==null?"/":"/?task="+Uri.encode(task));}
 private void openPath(String path){if(serverUrl().isEmpty()){configureServer();return;}String url=serverUrl()+path;try{new CustomTabsIntent.Builder().setShowTitle(true).build().launchUrl(this,Uri.parse(url));}catch(Exception e){try{startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse(url)));}catch(Exception second){toast("Cài trình duyệt để mở app.");}}}

 private void toast(String message){Toast.makeText(this,message,Toast.LENGTH_LONG).show();}
}

package vn.nhipviec.mobile;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
public class BootReceiver extends BroadcastReceiver {
 @Override public void onReceive(Context context,Intent intent){if(Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())||Intent.ACTION_MY_PACKAGE_REPLACED.equals(intent.getAction())||"android.app.action.SCHEDULE_EXACT_ALARM_PERMISSION_STATE_CHANGED".equals(intent.getAction())){WidgetSync.schedule(context);WidgetSync.refresh(context,null);ReminderScheduler.schedule(context);TaskWidget.updateAll(context);}}
}

package vn.nhipviec.mobile;
import android.app.job.JobService;
import android.app.job.JobParameters;
public class WidgetSyncJob extends JobService {
 @Override public boolean onStartJob(JobParameters params){if(WidgetSync.local(this)){TaskWidget.updateAll(this);return false;}WidgetSync.refresh(this,()->jobFinished(params,false));return true;}
 @Override public boolean onStopJob(JobParameters params){return true;}
}

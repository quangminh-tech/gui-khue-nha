-- DESIGN ONLY. Not a production migration. Create in an empty database for review.
PRAGMA foreign_keys = ON;
CREATE TABLE workspaces_v2(owner TEXT PRIMARY KEY,version INTEGER NOT NULL DEFAULT 1,retention_checked_at TEXT,retention_deleted_total INTEGER NOT NULL DEFAULT 0);
CREATE TABLE tasks_v2(
 owner TEXT NOT NULL,id TEXT NOT NULL,parent_id TEXT,title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 200),description TEXT NOT NULL DEFAULT '',project TEXT NOT NULL DEFAULT 'Cá nhân',assignee TEXT NOT NULL DEFAULT '',due_date TEXT NOT NULL,due_time TEXT NOT NULL,priority TEXT NOT NULL CHECK(priority IN ('Cao','Vừa','Thấp')),status TEXT NOT NULL CHECK(status IN ('todo','doing','done')),completed_at TEXT,reminder_minutes INTEGER NOT NULL DEFAULT 15 CHECK(reminder_minutes BETWEEN 0 AND 10080),
 PRIMARY KEY(owner,id),FOREIGN KEY(owner) REFERENCES workspaces_v2(owner) ON DELETE CASCADE,FOREIGN KEY(owner,parent_id) REFERENCES tasks_v2(owner,id) DEFERRABLE INITIALLY DEFERRED,CHECK(parent_id IS NULL OR parent_id<>id),CHECK((status='done' AND completed_at IS NOT NULL) OR (status<>'done' AND completed_at IS NULL))
);
CREATE INDEX tasks_owner_status_due ON tasks_v2(owner,status,due_date);
CREATE INDEX tasks_owner_parent ON tasks_v2(owner,parent_id);
CREATE INDEX tasks_completed_retention ON tasks_v2(owner,completed_at) WHERE status='done';
CREATE TABLE checklist_items_v2(owner TEXT NOT NULL,id TEXT NOT NULL,task_id TEXT NOT NULL,text TEXT NOT NULL,done INTEGER NOT NULL DEFAULT 0 CHECK(done IN(0,1)),sort_order INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(owner,id),FOREIGN KEY(owner,task_id) REFERENCES tasks_v2(owner,id) ON DELETE CASCADE);
CREATE INDEX checklist_task ON checklist_items_v2(owner,task_id,sort_order);
CREATE TABLE resources_v2(owner TEXT NOT NULL,id TEXT NOT NULL,title TEXT NOT NULL,url TEXT NOT NULL,kind TEXT NOT NULL CHECK(kind IN('sheet','doc','slides','powerpoint','pdf','website')),note TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL,PRIMARY KEY(owner,id),FOREIGN KEY(owner) REFERENCES workspaces_v2(owner) ON DELETE CASCADE);
CREATE INDEX resources_owner_kind ON resources_v2(owner,kind);
CREATE TABLE task_resources_v2(owner TEXT NOT NULL,task_id TEXT NOT NULL,resource_id TEXT NOT NULL,PRIMARY KEY(owner,task_id,resource_id),FOREIGN KEY(owner,task_id) REFERENCES tasks_v2(owner,id) ON DELETE CASCADE,FOREIGN KEY(owner,resource_id) REFERENCES resources_v2(owner,id) ON DELETE CASCADE);
CREATE INDEX resource_tasks ON task_resources_v2(owner,resource_id);

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Handshake,
  ExternalLink,
  Check,
} from 'lucide-react';
import { Button } from '../../components/Button.js';
import { Badge } from '../../components/Badge.js';
import { useSocketConnection } from '../../hooks/useSocket.js';
import { partnershipsApi } from '../../api/partnerships.api.js';
import type { IndustryNotification, IndustryNotificationType } from './types.js';

const ALLOWED_NOTIFICATION_TYPES: IndustryNotificationType[] = [
  'partnership request received',
  'university submitted proposal',
  'milestone completed',
  'pilot ready',
  'action required',
];

export default function Notifications() {
  useSocketConnection();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<IndustryNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'action_required'>('all');

  const fetchNotifs = () => {
    partnershipsApi
      .getNotifications()
      .then((data) => {
        // Filter strictly to the 5 industry-relevant event types
        const filtered = data.filter((n) =>
          ALLOWED_NOTIFICATION_TYPES.includes(n.type),
        );
        setNotifications(filtered);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await partnershipsApi.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllRead = async () => {
    await partnershipsApi.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const displayedNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'action_required') return n.actionRequired;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeIcon = (type: IndustryNotificationType) => {
    switch (type) {
      case 'partnership request received':
        return <Handshake className="h-4 w-4 text-forest" />;
      case 'university submitted proposal':
        return <FileText className="h-4 w-4 text-navy" />;
      case 'milestone completed':
        return <CheckCircle2 className="h-4 w-4 text-forest" />;
      case 'pilot ready':
        return <Clock className="h-4 w-4 text-turmeric-deep" />;
      case 'action required':
        return <AlertTriangle className="h-4 w-4 text-urgent" />;
    }
  };

  const getTypeBadgeTone = (type: IndustryNotificationType): 'green' | 'blue' | 'amber' | 'red' | 'neutral' => {
    switch (type) {
      case 'partnership request received':
        return 'green';
      case 'university submitted proposal':
        return 'blue';
      case 'milestone completed':
        return 'green';
      case 'pilot ready':
        return 'amber';
      case 'action required':
        return 'red';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-3">
        <span className="text-[10px] font-mono text-forest uppercase font-bold tracking-wider block">
          Communications &amp; Event Stream
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-0.5">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-bold text-navy">
              Industry Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-urgent text-white font-mono text-[11px] font-bold">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="secondary"
              onClick={handleMarkAllRead}
              className="text-xs gap-1.5 py-1 px-3"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Mark all as read</span>
            </Button>
          )}
        </div>
        <p className="text-xs text-ink-muted mt-0.5">
          Live stream of partnership approvals, R&amp;D proposal submissions, milestone completions, and pilot alerts.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition border ${
            filter === 'all'
              ? 'border-navy bg-navy text-white font-bold'
              : 'border-border bg-white text-ink-muted hover:border-navy hover:text-navy'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition border ${
            filter === 'unread'
              ? 'border-navy bg-navy text-white font-bold'
              : 'border-border bg-white text-ink-muted hover:border-navy hover:text-navy'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('action_required')}
          className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition border ${
            filter === 'action_required'
              ? 'border-urgent bg-urgent text-white font-bold'
              : 'border-border bg-white text-ink-muted hover:border-urgent hover:text-urgent'
          }`}
        >
          Action Required ({notifications.filter((n) => n.actionRequired).length})
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded border border-border bg-white" />
          ))}
        </div>
      ) : displayedNotifs.length === 0 ? (
        <div className="border border-dashed border-border bg-white p-8 text-center space-y-2">
          <Bell className="mx-auto h-8 w-8 text-ink-muted/50" />
          <p className="text-sm font-semibold text-navy">No notifications found</p>
          <p className="text-xs text-ink-muted">
            {filter === 'unread'
              ? 'You have caught up with all partnership alerts!'
              : 'No alerts matching this filter.'}
          </p>
        </div>
      ) : (
        <div className="border border-border bg-white divide-y divide-border shadow-sm">
          {displayedNotifs.map((item) => (
            <div
              key={item.id}
              className={`p-4 transition flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                !item.read ? 'bg-turmeric/5' : 'hover:bg-paper/50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Type Icon Badge */}
                <div className="flex h-9 w-9 items-center justify-center border border-border bg-paper rounded-[2px] shrink-0 mt-0.5">
                  {getTypeIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={getTypeBadgeTone(item.type)}>
                      {item.type}
                    </Badge>
                    {!item.read && (
                      <span className="h-2 w-2 rounded-full bg-turmeric inline-block" />
                    )}
                    <span className="text-[11px] font-mono text-ink-muted">{item.date}</span>
                  </div>

                  <h4 className="font-display text-xs font-bold text-navy">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {item.projectId && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/industry/contributions/${item.projectId}`)}
                    className="text-xs py-1 px-2.5 gap-1 border border-border"
                  >
                    <span>View Progress</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
                {!item.read && (
                  <Button
                    variant="secondary"
                    onClick={() => handleMarkAsRead(item.id)}
                    className="text-xs py-1 px-2.5"
                  >
                    Mark Read
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

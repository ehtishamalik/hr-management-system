"use client";

import Headline from "@/components/headline";

import { toast } from "sonner";
import { clipText } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { authClient } from "@/lib/auth/auth-client";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  ShieldCheck,
  LogOut,
  RefreshCw,
  Globe,
  Clock,
  HardDrive,
  MapPin,
} from "lucide-react";

import type { SessionTableSelectType } from "@/types";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionTableSelectType[]>([]);
  const [locations, setLocations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);
  const { data: currentSession } = authClient.useSession();

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await authClient.listSessions();

      if (error) {
        throw new Error(error.message || "Failed to fetch sessions");
      }
      if (data) {
        const sessionData = data as unknown as SessionTableSelectType[];
        setSessions(sessionData);

        const uniqueIps = Array.from(
          new Set(
            sessionData
              .map((s) => s.ipAddress)
              .filter((ip): ip is string => !!ip),
          ),
        );

        for (const ip of uniqueIps) {
          try {
            const res = await fetch(`https://ipapi.co/${ip}/json/`);
            const locData = await res.json();

            if (locData.error) {
              setLocations((prev) => ({
                ...prev,
                [ip]: "Not Found",
              }));
              continue;
            }

            if (locData.city && locData.country_name) {
              const locationInfo = `${locData.city}, ${locData.country_name}${locData.org ? ` (${locData.org})` : ""}`;
              setLocations((prev) => ({
                ...prev,
                [ip]: locationInfo,
              }));
            }
          } catch (e) {
            console.error(`Failed to fetch location for ${ip}`, e);
            setLocations((prev) => ({
              ...prev,
              [ip]: "Not Found",
            }));
          }
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      toast.error(error.message || "Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleRevoke = async (token: string, sessionId: string) => {
    setRevokingId(sessionId);
    try {
      const { error } = await authClient.revokeSession({
        token: token,
      });
      if (error) throw new Error(error.message);
      toast.success("Session revoked successfully");
      fetchSessions();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to revoke session");
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAllOther = async () => {
    setRevokingAll(true);
    try {
      const { error } = await authClient.revokeOtherSessions();

      if (error) throw new Error(error.message);

      toast.success("Other sessions revoked successfully");
      fetchSessions();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Some sessions could not be revoked");
    } finally {
      setRevokingAll(false);
    }
  };

  const getDeviceIcon = (userAgent?: string | null) => {
    if (!userAgent) return <Monitor className="h-4 w-4" />;
    const ua = userAgent.toLowerCase();
    if (
      ua.includes("iphone") ||
      ua.includes("android") ||
      ua.includes("mobile")
    )
      return <Smartphone className="h-4 w-4" />;
    if (ua.includes("tablet") || ua.includes("ipad") || ua.includes("playbook"))
      return <Tablet className="h-4 w-4" />;
    if (ua.includes("mac") || ua.includes("windows") || ua.includes("linux"))
      return <Laptop className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const parseUA = (userAgent?: string | null) => {
    if (!userAgent) return "Unknown Device";

    const ua = userAgent;
    let browser = "Browser";
    let device = "Unknown Device";

    // Browser detection
    if (ua.includes("Edg/")) browser = "Edge";
    else if (ua.includes("OPR/") || ua.includes("Opera/")) browser = "Opera";
    else if (ua.includes("Chrome/")) browser = "Chrome";
    else if (ua.includes("Firefox/")) browser = "Firefox";
    else if (ua.includes("Safari/") && !ua.includes("Chrome"))
      browser = "Safari";

    // OS and Device detection
    if (ua.includes("Android")) {
      const match = ua.match(/Android [^;]+; ([^;)]+)/);
      device = match ? match[1] : "Android Device";
    } else if (ua.includes("iPhone")) {
      device = "iPhone";
    } else if (ua.includes("iPad")) {
      device = "iPad";
    } else if (ua.includes("Macintosh")) {
      device = "Mac";
    } else if (ua.includes("Windows NT 10.0")) {
      device = "Windows 11/10";
    } else if (ua.includes("Windows NT 6.3")) {
      device = "Windows 8.1";
    } else if (ua.includes("Windows NT 6.2")) {
      device = "Windows 8";
    } else if (ua.includes("Windows NT 6.1")) {
      device = "Windows 7";
    } else if (ua.includes("Linux")) {
      device = "Linux";
    }

    return `${browser} on ${device}`;
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <Headline>Active Sessions</Headline>
          <p className="text-muted-foreground text-sm">
            Manage your active sessions on different devices.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSessions}
            disabled={loading}
          >
            <RefreshCw className={`${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRevokeAllOther}
            disabled={loading || revokingAll || sessions.length <= 1}
          >
            {revokingAll ? <Spinner /> : <LogOut />}
            Logout other devices
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Connected Devices
          </CardTitle>
          <CardDescription>
            This list shows all devices that are currently logged into your
            account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device / Browser</TableHead>
                  <TableHead className="hidden md:table-cell">
                    IP Address
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Last Active
                  </TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 2 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-37.5" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Skeleton className="h-5 w-25" />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Skeleton className="h-5 w-30" />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Skeleton className="h-5 w-30" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-20 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  : sessions.map((session) => {
                      const isCurrent =
                        session.token === currentSession?.session.token;
                      return (
                        <TableRow key={session.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-secondary rounded-full">
                                {getDeviceIcon(session.userAgent)}
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {parseUA(session.userAgent)}
                                  </span>
                                  {isCurrent && (
                                    <Badge variant="default" size="sm">
                                      This device
                                    </Badge>
                                  )}
                                </div>
                                <span
                                  className="text-xs text-muted-foreground truncate max-w-50 md:max-w-xs"
                                  title={
                                    session.userAgent || "Unknown User Agent"
                                  }
                                >
                                  {session.userAgent || "Unknown User Agent"}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell
                            className="hidden md:table-cell font-mono text-xs"
                            title={session.ipAddress || "Unknown"}
                          >
                            {clipText(session.ipAddress || "Unknown")}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                            {session.ipAddress &&
                            locations[session.ipAddress] ? (
                              <div
                                className="flex items-center gap-1 truncate max-w-37.5"
                                title={locations[session.ipAddress]}
                              >
                                <MapPin className="h-3 w-3 text-primary" />
                                {clipText(locations[session.ipAddress])}
                              </div>
                            ) : (
                              "Retrieving..."
                            )}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {session.updatedAt &&
                                formatDistanceToNow(
                                  new Date(session.updatedAt),
                                  {
                                    addSuffix: true,
                                  },
                                )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isCurrent || revokingId === session.id}
                              onClick={() =>
                                handleRevoke(session.token, session.id)
                              }
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              {revokingId === session.id ? (
                                <RefreshCw className="animate-spin" />
                              ) : (
                                <LogOut />
                              )}
                              <span className="hidden lg:inline">Logout</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4" />
              IP Transparency
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            We record the IP address of every login to help you identify
            suspicious activity. If you see an IP address you don't recognize,
            you should revoke that session.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Session Persistence
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Sessions automatically expire after 7 days of inactivity. Revoking a
            session immediately invalidates the access token for that device.
          </CardContent>
        </Card>
      </div>
    </>
  );
}

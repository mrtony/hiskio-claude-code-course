import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface UserHeaderProps {
  onShowHistory: () => void;
  onOpenAuth: () => void;
}

export function UserHeader({ onShowHistory, onOpenAuth }: UserHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-between px-4 py-2 mb-4 bg-amber-200/60 rounded-lg border border-amber-300">
      <span className="text-amber-900 text-sm">
        {user ? user.email : '訪客模式'}
      </span>
      <div className="flex gap-2">
        {user ? (
          <>
            <Button variant="outline" size="sm" onClick={onShowHistory}>
              歷史分數
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              登出
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" onClick={onOpenAuth}>
            登入 / 註冊
          </Button>
        )}
      </div>
    </div>
  );
}

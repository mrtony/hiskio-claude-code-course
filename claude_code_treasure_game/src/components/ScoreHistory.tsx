import { useState, useEffect } from 'react';
import { getScores, GameScore } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function ScoreHistory() {
  const [scores, setScores] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScores()
      .then(setScores)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const resultLabel = (result: string) => {
    switch (result) {
      case 'win': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Win</Badge>;
      case 'tie': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Tie</Badge>;
      case 'loss': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Loss</Badge>;
      default: return result;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-amber-900">歷史分數</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-amber-700">載入中...</p>
        ) : scores.length === 0 ? (
          <p className="text-center text-amber-700">尚無遊戲紀錄</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日期</TableHead>
                <TableHead>分數</TableHead>
                <TableHead>結果</TableHead>
                <TableHead>開箱數</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{new Date(s.played_at + 'Z').toLocaleString('zh-TW')}</TableCell>
                  <TableCell className={s.score >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${s.score}
                  </TableCell>
                  <TableCell>{resultLabel(s.result)}</TableCell>
                  <TableCell>{s.chests_opened}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

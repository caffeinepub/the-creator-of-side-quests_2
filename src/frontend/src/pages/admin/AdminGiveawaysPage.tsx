import { useState } from 'react';
import { usePageMeta } from '../../hooks/usePageMeta';
import {
  useAdminActiveGiveaways,
  useAdminGiveaway,
  useAddGiveawayEntrantByAdmin,
  useSelectGiveawayWinner,
} from '../../hooks/admin/useAdminGiveaways';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import AdminGiveawayWheel from '../../components/giveaway/AdminGiveawayWheel';
import { Plus, Trophy } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminGiveawaysPage() {
  usePageMeta('Manage Giveaways', 'Create and manage giveaways with winner selection.');

  const { data: activeGiveaways, isLoading: loadingGiveaways } = useAdminActiveGiveaways();
  const [selectedGiveawayId, setSelectedGiveawayId] = useState<string | null>(null);
  const { data: selectedGiveaway, isLoading: loadingGiveaway } = useAdminGiveaway(selectedGiveawayId);
  const addEntrant = useAddGiveawayEntrantByAdmin();
  const selectWinner = useSelectGiveawayWinner();

  const [principalText, setPrincipalText] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);

  const handleAddEntrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGiveawayId || !principalText.trim() || !displayName.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await addEntrant.mutateAsync({
        giveawayId: selectedGiveawayId,
        principalText: principalText.trim(),
        displayName: displayName.trim(),
      });
      setPrincipalText('');
      setDisplayName('');
    } catch (error: any) {
      // Error already handled by mutation
    }
  };

  const handleSpin = () => {
    if (!selectedGiveaway || selectedGiveaway.entrants.length === 0) {
      toast.error('No entrants available to spin');
      return;
    }
    setIsSpinning(true);
  };

  const handleSpinComplete = async (selectedIndex: number) => {
    setIsSpinning(false);
    if (!selectedGiveawayId) return;

    try {
      await selectWinner.mutateAsync({
        giveawayId: selectedGiveawayId,
        winnerIndex: selectedIndex,
      });
    } catch (error: any) {
      // Error already handled by mutation
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  if (loadingGiveaways) {
    return <p className="text-muted-foreground">Loading giveaways...</p>;
  }

  if (!activeGiveaways || activeGiveaways.length === 0) {
    return (
      <div>
        <h1 className="mb-8 font-serif text-3xl font-bold">Manage Giveaways</h1>
        <Card>
          <CardContent className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">
              No active giveaways. Create a giveaway to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Manage Giveaways</h1>

      <div className="mb-6">
        <Label htmlFor="giveaway-select">Select Giveaway</Label>
        <Select value={selectedGiveawayId || ''} onValueChange={setSelectedGiveawayId}>
          <SelectTrigger id="giveaway-select">
            <SelectValue placeholder="Choose a giveaway" />
          </SelectTrigger>
          <SelectContent>
            {activeGiveaways.map((giveaway) => (
              <SelectItem key={giveaway.id} value={giveaway.id}>
                {giveaway.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedGiveaway && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{selectedGiveaway.name}</CardTitle>
              <CardDescription>{selectedGiveaway.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Badge variant="outline">
                  {selectedGiveaway.entrants.length} Entrant{selectedGiveaway.entrants.length !== 1 ? 's' : ''}
                </Badge>
                <Badge variant="outline">
                  {selectedGiveaway.winners.length} Winner{selectedGiveaway.winners.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add Entrant</CardTitle>
                <CardDescription>Manually add an entrant to this giveaway</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddEntrant} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="principal">Principal ID</Label>
                    <Input
                      id="principal"
                      value={principalText}
                      onChange={(e) => setPrincipalText(e.target.value)}
                      placeholder="Enter principal ID"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter display name"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={addEntrant.isPending} className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    {addEntrant.isPending ? 'Adding...' : 'Add Entrant'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Winner Wheel</CardTitle>
                <CardDescription>Spin to select a random winner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AdminGiveawayWheel
                  entrants={selectedGiveaway.entrants}
                  onSpinComplete={handleSpinComplete}
                  isSpinning={isSpinning}
                />
                <Button
                  onClick={handleSpin}
                  disabled={isSpinning || selectedGiveaway.entrants.length === 0 || selectWinner.isPending}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Trophy className="h-5 w-5" />
                  {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
                </Button>
                {selectedGiveaway.entrants.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    Add entrants before spinning the wheel
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Entrants ({selectedGiveaway.entrants.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Display Name</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Entered At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedGiveaway.entrants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No entrants yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedGiveaway.entrants.map((entrant, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{entrant.displayName}</TableCell>
                          <TableCell className="font-mono text-xs">{entrant.principal.toString()}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(entrant.enteredAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Winners History ({selectedGiveaway.winners.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Winner</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Won At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedGiveaway.winners.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No winners yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedGiveaway.winners.map((winner, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Trophy className="h-4 w-4 text-primary" />
                              {winner.entrant.displayName}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {winner.entrant.principal.toString()}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(winner.wonAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

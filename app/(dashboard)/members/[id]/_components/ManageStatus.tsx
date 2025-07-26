import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";

export default function ManageStatus() {
    return (
        <Card>
            <CardHeader className="xxl:!pb-0">
                <CardTitle>Manage Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">In Active</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" className="w-full">
                    Submit
                </Button>
            </CardContent>
        </Card>
    )
}
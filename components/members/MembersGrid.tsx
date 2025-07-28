"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ban, Calendar, Edit, Eye, Mail, MapPin, Package, User, Trash, Loader2 } from "lucide-react";
import Link from "next/link";
import { Member } from "@/app/(dashboard)/members/_types/member";

interface MembersGridProps {
  members: Member[];
  isLoading: boolean;
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  onDeleteClick: (id: string) => void;
  deletingMemberId?: string | null;
}

export default function MembersGrid({
  members,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onDeleteClick,
  deletingMemberId,
}: MembersGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => {
          const isDeleting = deletingMemberId === member.id.toString();
          
          return (
            <Card key={member.id} className={`overflow-hidden ${isDeleting ? "opacity-50" : ""}`}>
              <CardContent className="!p-0">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between bg-muted p-2 lg:p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.image || "/user-2.png"} alt={`${member.firstName} ${member.lastName}`} />
                        <AvatarFallback>{member.firstName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.firstName} {member.lastName}</div>
                        <div className="text-xs text-muted-foreground">{member.isPremium ? "Premium Member" : "Free Member"}</div>
                      </div>
                    </div>
                    <Badge variant={member.isActive ? "success" : "secondary"}>
                      {member.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="p-4">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Joined {new Date(member.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{member.gender}, {member.age} years</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{member.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Plan: {member.isPremium ? "Premium" : "Free"}</span>
                      </div>
                    </div>
                  </div>

                  {isDeleting ? (
                    <div className="flex items-center justify-center border-t p-4">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm text-muted-foreground">Deleting member...</span>
                    </div>
                  ) : (
                    <div className="flex border-t">
                      <Button asChild variant="ghost" className="flex-1 rounded-none rounded-bl-md py-2 justify-center">
                        <Link href={`/members/${member.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button asChild variant="ghost" className="flex-1 rounded-none border-l py-2 justify-center">
                        <Link href={`/members/${member.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button variant="ghost" className="flex-1 rounded-none border-l py-2 justify-center">
                        <Ban className="h-4 w-4 text-yellow-600" />
                      </Button>

                      <Button 
                        variant="ghost" 
                        className="flex-1 rounded-none rounded-br-md border-l py-2 justify-center"
                        onClick={() => onDeleteClick(member.id.toString())}
                      >
                        <Trash className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>1-{members.length}</strong> of <strong>{members.length}</strong> members
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === 1} 
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={!totalPages || currentPage >= totalPages} 
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
} 
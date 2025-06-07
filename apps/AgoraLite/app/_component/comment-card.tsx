import type React from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { Comment } from "@/types/home"

interface CommentCardProps {
  comment: Comment
  onLike?: () => void
  onReply?: () => void
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment, onLike, onReply }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: comment.author.avatar }} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.authorName}>{comment.author.name}</Text>
          <Text style={styles.username}>@{comment.author.username}</Text>
          <Text style={styles.timestamp}>{formatDate(comment.createdAt)}</Text>
        </View>

        <Text style={styles.commentText}>{comment.content}</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.action} onPress={onLike}>
            <Ionicons name="heart-outline" size={16} color="#6B7280" />
            <Text style={styles.actionText}>{comment.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.action} onPress={onReply}>
            <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        </View>

        {comment.replies && comment.replies.length > 0 && (
          <View style={styles.replies}>
            {comment.replies.map((reply) => (
              <CommentCard key={reply.id} comment={reply} />
            ))}
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  username: {
    fontSize: 12,
    color: "#6B7280",
  },
  timestamp: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: "auto",
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  replies: {
    marginTop: 12,
    marginLeft: -44,
    paddingLeft: 44,
    borderLeftWidth: 2,
    borderLeftColor: "#F3F4F6",
  },
})

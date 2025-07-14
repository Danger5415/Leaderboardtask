import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Present' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Present' : 'Missing');
  process.exit(1);
}

console.log('🔗 Connecting to Supabase:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Test database connection
const testConnection = async () => {
  try {
    console.log('🧪 Testing Supabase connection...');
    const { data, error } = await supabase
      .from('users')
      .select('count(*)')
      .single();
    
    if (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
    
    console.log('✅ Database connection successful!');
    console.log('📊 Users count:', data?.count || 0);
    return true;
  } catch (error) {
    console.error('❌ Connection test error:', error);
    return false;
  }
};

// API Routes

// Get all users with ranking
app.get('/api/users', async (req, res) => {
  try {
    console.log('🔍 Fetching all users from database...');
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('totalPoints', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching users:', error);
      return res.status(500).json({ 
        error: `Database query failed: ${error.message}`,
        details: error
      });
    }

    console.log('📊 Successfully fetched', users?.length || 0, 'users');
    
    if (!users || users.length === 0) {
      console.log('⚠️ No users found in database');
      return res.json({ users: [] });
    }

    // Add ranking to users
    const usersWithRanking = users.map((user, index) => ({
      ...user,
      rank: index + 1,
      avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
    }));

    console.log('🏆 Returning', usersWithRanking.length, 'users with rankings');
    res.json({ users: usersWithRanking });
  } catch (error) {
    console.error('❌ Server error in /api/users:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Add new user
app.post('/api/users', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .insert([{ name: name.trim(), totalPoints: 0 }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Claim points for a user
app.post('/api/claim-points', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Generate random points between 1 and 10
    const pointsAwarded = Math.floor(Math.random() * 10) + 1;

    // Get current user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user's total points
    const newTotalPoints = user.totalPoints + pointsAwarded;
    const { error: updateError } = await supabase
      .from('users')
      .update({ totalPoints: newTotalPoints })
      .eq('id', userId);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    // Add entry to points history
    const { error: historyError } = await supabase
      .from('points_history')
      .insert([{
        userId: userId,
        pointsAwarded: pointsAwarded
      }]);

    if (historyError) {
      return res.status(500).json({ error: historyError.message });
    }

    res.json({
      success: true,
      pointsAwarded,
      newTotalPoints,
      user: { ...user, totalPoints: newTotalPoints }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get points history
app.get('/api/points-history', async (req, res) => {
  try {
    const { data: history, error } = await supabase
      .from('points_history')
      .select(`
        *,
        users (
          name,
          avatar
        )
      `)
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('totalPoints', { ascending: false })
      .limit(10);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Add ranking to users
    const leaderboard = users.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(5000, async () => {
  console.log(`✅ API Server running on http://localhost:5000`);
  console.log(`📊 API endpoints available at http://localhost:5000/api`);
  console.log(`🎯 Frontend should be running on http://localhost:5173`);
  
  // Test connection on startup
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.error('❌ Failed to connect to database on startup');
    console.error('🔧 Please check your Supabase credentials in .env file');
  } else {
    console.log('🚀 Server fully initialized and ready');
  }
});

// Add a health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count(*)')
      .single();
    
    if (error) {
      return res.status(500).json({ 
        status: 'unhealthy', 
        database: 'disconnected',
        error: error.message
      });
    }
    
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      userCount: data?.count || 0
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'error',
      error: error.message
    });
  }
});

// Handle server errors
app.on('error', (error) => {
  console.error('❌ Server error:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Server shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Server shutting down gracefully...');
  process.exit(0);
});
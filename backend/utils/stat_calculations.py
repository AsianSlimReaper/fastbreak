#purpose:check whether the team won or lost
#input:team pts, opponent points
#output win,loss or draw depending on which input was larger
def game_result(pts: int, opponent_pts: int) -> str:
    #check which input was larger to determine the result
    if pts > opponent_pts:
        return "win"
    elif pts == opponent_pts:
        return "draw"
    else:
        return "loss"

#purpose: calculate points
#input: two-point made, three-point made, free throws made
#output: total points scored
def calculate_pts(two_pm, three_pm, ftm):
    #returns the total points scored based on the number of two-point, three-point, and free throws made
    return 2 * two_pm + 3 * three_pm + ftm

#purpose: calculate field goals made
#input: two-point made, three-point made
#output: total field goals made
def calculate_fgm(two_pm, three_pm):
    #returns the total field goals made based on the number of two-point and three-point shots made
    return two_pm + three_pm

#purpose: calculate field goal attempts
#input: two-point attempts, three-point attempts
#output: total field goal attempts
def calculate_fga(two_pa, three_pa):
    #returns the total field goal attempts based on the number of two-point and three-point attempts
    return two_pa + three_pa

#purpose: calculate free throws made
#input: free throws made
#output: total free throws made
def calculate_fg_percent(fgm, fga):
    #returns the field goal percentage based on the number of field goals made and attempted
    return round(fgm / fga, 2) if fga else 0.0

#purpose: calculate two-point percentage
#input: two-point made, two-point attempts
#output: two-point shooting percentage
def calculate_2p_percent(two_pm, two_pa):
    #returns the two-point shooting percentage based on the number of two-point shots made and attempted
    return round(two_pm / two_pa, 2) if two_pa else 0.0

#purpose: calculate three-point percentage
#input: three-point made, three-point attempts
#output: three-point shooting percentage
def calculate_3p_percent(three_pm, three_pa):
    #returns the three-point shooting percentage based on the number of three-point shots made and attempted
    return round(three_pm / three_pa, 2) if three_pa else 0.0

#purpose: calculate free throw percentage
#input: free throws made, free throw attempts
#output: free throw shooting percentage
def calculate_ft_percent(ftm, fta):
    #returns the free throw shooting percentage based on the number of free throws made and attempted
    return round(ftm / fta, 2) if fta else 0.0

#purpose: calculate effective field goal percentage
#input: field goals made, three-point made, field goal attempts
#output: effective field goal percentage
def calculate_efg_percent(fgm, three_pm, fga):
    #returns the effective field goal percentage based on the number of field goals made, three-point shots made, and field goal attempts
    return round((fgm + 0.5 * three_pm) / fga, 2) if fga else 0.0

#purpose: calculate true shooting percentage
#input: points scored, field goal attempts, free throw attempts
#output: true shooting percentage
def calculate_ts_percent(pts, fga, fta):
    #returns the true shooting percentage based on the total points scored, field goal attempts, and free throw attempts
    denominator = 2 * (fga + 0.44 * fta)
    return round(pts / denominator, 2) if denominator else 0.0

#purpose: calculate player efficiency rating
#input: points, rebounds, assists, steals, blocks, field goal attempts, field goals made, free throw attempts, free throws made, turnovers
#output: player efficiency rating
def calculate_efficiency(pts, reb, ast, stl, blk, fga, fgm, fta, ftm, tov):
    # calculates the number of missed field goals and free throws
    missed_fg = fga - fgm
    missed_ft = fta - ftm
    #returns the player efficiency rating based on the points, rebounds, assists, steals, blocks, field goal attempts, field goals made, free throw attempts, free throws made, and turnovers
    return pts + reb + ast + stl + blk - missed_fg - missed_ft - tov

#purpose: calculate rebounds
#input: offensive rebounds, defensive rebounds
#output: total rebounds
def calculate_rebounds(oreb, dreb):
    # returns the total rebounds based on the number of offensive and defensive rebounds
    return oreb + dreb

#purpose: calculate posessions
#input: field goal attempts, free throw attempts, offensive rebounds, turnovers
#output: total possessions
def calculate_possessions(fga, fta, oreb, tov):
    # returns the total possessions based on the number of field goal attempts, free throw attempts, offensive rebounds, and turnovers
    return fga + 0.44 * fta - oreb + tov

#purpose: calculate offensive rating
#input: points scored, possessions
#output: offensive rating
def calculate_off_rtg(pts, possessions):
    # returns the offensive rating based on the total points scored and possessions and checks if possessions is zero to avoid division by zero
    return round(100 * pts / possessions, 1) if possessions else 0.0

#purpose: calculate defensive rating
#input: opponent points scored, opponent possessions
#output: defensive rating
def calculate_def_rtg(opponent_pts, opponent_possessions):
    # returns the defensive rating based on the opponent's points scored and possessions and checks if opponent possessions is zero to avoid division by zero
    return round(100 * opponent_pts / opponent_possessions, 1) if opponent_possessions else 0.0

#purpose: calculate net rating
#input: offensive rating, defensive rating
#output: net rating
def calculate_net_rtg(off_rtg, def_rtg):
    # returns the net rating based on the offensive and defensive ratings
    return round(off_rtg - def_rtg, 1)

#purpose: calculate pace
#input: team possessions, opponent possessions, minutes played
#output: pace
def calculate_pace(team_possessions, opponent_possessions, minutes_played):
    # returns the pace based on the total possessions of the team and opponent, and the minutes played
    total_possessions = team_possessions + opponent_possessions
    #checks if minutes played is zero to avoid division by zero
    return round(48 * total_possessions / (2 * minutes_played), 1) if minutes_played else 0.0

import os

import pandas as pd
import numpy as np
from enum import Enum
import matplotlib.pyplot as plt

import matplotlib.cm as cm
# print(plt.style.available)
# Enums

# class Frequency(Enum):
#     very_dissatisfied = 1
#     dissatisfied = 2
#     neutral = 3
#     satisfied = 4
#     very_satisfied = 5

class Satisfaction(Enum):
    very_dissatisfied = 1
    dissatisfied = 2
    neutral = 3
    satisfied = 4
    very_satisfied = 5

class Difficulty(Enum):
    very_difficult = 1
    somewhat_difficult = 2
    neutral = 3
    somewhat_easy = 4
    easy = 5

class Security(Enum):
    very_insecure = 1
    somewhat_insecure = 2
    neutral = 3
    somewhat_secure = 4
    very_secure = 5

class Clarity(Enum):
    very_unclear = 1
    unclear = 2
    somewhat_clear = 3
    clear = 4
    very_clear = 5

class Difficulty2(Enum):
    much_harder = 1
    slightly_harder = 2
    the_same = 3
    slightly_easier = 4
    much_easier = 5

class Like(Enum):
    strongly_dislike = 1
    dislike = 2
    neutral = 3
    like = 4
    strongly_like = 5

class ProtoId(Enum):
    push_notification = 1
    user_controlled_time_frame = 2
    face_id = 3
    existing_duo = 4

# Column to Enum mapping (update this to match your actual column names)
column_enum_map = {
    'Q2': Satisfaction,
    'Q3': Difficulty,
    'Q4': Security,
    'Q6': Clarity,
    'Q7': Difficulty2,
    'Q8': Security,
    'Q11': Like,
    'Q13': Clarity,
    'Q14': Difficulty2,
    'Q15': Security,
    'Q18': Like,
    'Q20': Clarity,
    'Q21': Difficulty2,
    'Q22': Security,
    'Q25': Like,
    'Q26': ProtoId,
    'Q27': ProtoId,
    'Q28': ProtoId,
    # Add other mappings as needed
}

questionChartTitle = {
    'Q27' : 'Most Liked',
    'Q28' : 'Least liked'
}

if __name__ == "__main__":
    df = pd.read_csv('evaluation_results.csv')
    columns_to_remove = ['Q5', 'Q9', 'Q12', 'Q19', 'Q10', 'Q16', 'Q17','Q23', 'Q24', 'Q29']
    df = df.drop(columns=columns_to_remove)

    # Convert strings to lowercase and replace spaces with underscores
    for col in df.columns:
        if df[col].dtype == object:
            df[col] = df[col].str.lower().str.replace(' ', '_')

    # Convert string responses to Enum values
    # for col, enum_cls in column_enum_map.items():
    #     if col in df.columns:
    #         df[col] = df[col].apply(lambda x: enum_cls[x].value if pd.notnull(x) and x in enum_cls.__members__ else np.nan)

    for col, enum_cls in column_enum_map.items():
        if col in df.columns:
            invalid_entries = df[~df[col].isin(enum_cls.__members__.keys())][col]
            if not invalid_entries.empty:
                raise ValueError(f"Column '{col}' has invalid values: {invalid_entries.unique().tolist()}")
            df[col] = df[col].apply(lambda x: enum_cls[x].value)

    df.to_csv('encodedData')

    # Generate a color map (e.g., from the 'tab10' or 'Set3' colormap)
    color_map = plt.colormaps['Set3']  # 5 categories per Enum
    # Create consistent colors for values 1 to 5
    fixed_colors = {i + 1: color_map(i) for i in range(5)}  # Maps 1–5 to RGBA

    plt.style.use('seaborn-v0_8-pastel')  # Optional: Use a built-in style
    # colors = [fixed_colors[member.value] for member in column_enum_map]
    # Directory to save bar charts
    output_dir = "pie_charts"
    os.makedirs(output_dir, exist_ok=True)  # Create if it doesn't exist
    for col in column_enum_map:
        if col in df.columns:
            enum_cls = column_enum_map[col]
            colors = [fixed_colors[member.value] for member in enum_cls]
            value_counts = df[col].value_counts().sort_index()

            labels = [member.name.replace('_', ' ').title() for member in enum_cls]
            values = [value_counts.get(member.value, 0) for member in enum_cls]

            plt.figure(figsize=(6, 6))
            wedges, texts, autotexts = plt.pie(
                values,
                labels=None,
                autopct='%1.1f%%',
                startangle=140,
                counterclock=False,
                wedgeprops={'edgecolor': 'black', 'linewidth': 1},  # Solid border
                colors=colors  # <== apply consistent colors
            )

            if col == 'Q28':
                plt.legend(
                    wedges,
                    labels,
                    title="Options",
                    loc="lower right",
                    bbox_to_anchor=(1, 0)
                )

            title =f"Distribution for {col}";
            if col in questionChartTitle:
                title = questionChartTitle[col]
            plt.title(title)
            plt.axis('equal')
            plt.tight_layout()
            # plt.show()
            # Save the figure
            save_path = os.path.join(output_dir, f"{col}_pie_chart.png")
            plt.savefig(save_path)
            plt.close()  # Close the figure to free memory

    # Directory to save bar charts
    output_dir = "bar_charts"
    os.makedirs(output_dir, exist_ok=True)  # Create if it doesn't exist

    plt.style.use('seaborn-v0_8-pastel')
    # colors = [fixed_colors[member.value] for member in column_enum_map]

    for col in column_enum_map:
        if col in df.columns:
            enum_cls = column_enum_map[col]
            colors = [fixed_colors[member.value] for member in enum_cls]
            value_counts = df[col].value_counts().sort_index()

            # Labels and values
            labels = [member.name.replace('_', ' ').title() for member in enum_cls]
            values = [value_counts.get(member.value, 0) for member in enum_cls]

            # Plot
            plt.figure(figsize=(8, 5))
            bars = plt.bar(labels, values, color=colors, edgecolor='black')

            # Annotate values on top
            for bar in bars:
                height = bar.get_height()
                plt.annotate(f'{height}',
                             xy=(bar.get_x() + bar.get_width() / 2, height),
                             xytext=(0, 3),  # Offset
                             textcoords="offset points",
                             ha='center', va='bottom')

            plt.title(f"Distribution for {col}")
            plt.ylabel("Number of Responses")
            plt.xticks(rotation=45, ha='right')
            plt.tight_layout()

            # Save the figure
            save_path = os.path.join(output_dir, f"{col}_bar_chart.png")
            plt.savefig(save_path)
            plt.close()  # Close the figure to free memory

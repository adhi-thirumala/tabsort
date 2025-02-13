
import csv
import sys

def user_compare(name1, name2):
    """
    Prompts the user to choose the better name between name1 and name2.
    Returns True if name1 should come before name2, otherwise False.
    """
    while True:
        print("\nWhich name is better?")
        print("1:", name1)
        print("2:", name2)
        choice = input("Enter 1 or 2: ").strip()
        if choice == "1":
            return True
        elif choice == "2":
            return False
        else:
            print("Invalid input. Please enter 1 or 2.")

def merge(left, right):
    """
    Merges two lists (left and right) by comparing their elements via user input.
    """
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if user_compare(left[i], right[j]):
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    # Append any remaining elements
    result.extend(left[i:])
    result.extend(right[j:])
    return result

def merge_sort(arr):
    """
    Recursively sorts the list arr using merge sort and user comparisons.
    """
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left_sorted = merge_sort(arr[:mid])
    right_sorted = merge_sort(arr[mid:])
    return merge(left_sorted, right_sorted)

def main():
    if len(sys.argv) < 2:
        print("Usage: python interactive_sort.py <csv_file>")
        sys.exit(1)

    csv_file = sys.argv[1]
    names = []

    # Open and parse the CSV file
    try:
        with open(csv_file, newline='', encoding='utf-8') as f:
            reader = csv.reader(f)
            # Skip the header row
            header = next(reader, None)
            for row in reader:
                # Ensure the row has at least two columns
                if len(row) >= 2:
                    first_name = row[0].strip()
                    last_name = row[1].strip()
                    full_name = first_name + " " + last_name
                    names.append(full_name)
    except FileNotFoundError:
        print(f"Error: File '{csv_file}' not found.")
        sys.exit(1)
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

    # Display the unsorted names
    print("\nUnsorted Names:")
    for name in names:
        print(name)

    print("\nStarting the interactive sorting process...")
    sorted_names = merge_sort(names)

    # Display the final ranking based on interactive sorting
    print("\nFinal Ranking (Interactive Sort Order):")
    for idx, name in enumerate(sorted_names, start=1):
        print(f"Rank {idx}: {name}")

    # Create a dictionary mapping names to their ranking positions
    ranking_dict = {name: idx for idx, name in enumerate(sorted_names, start=1)}

    # Now sort the names alphabetically
    alphabetical_names = sorted(names)

    # Display each name in alphabetical order along with its ranking position
    print("\nNames in Alphabetical Order with Ranking Positions:")
    for name in alphabetical_names:
        print(f"{name}: Rank {ranking_dict[name]}")

if __name__ == '__main__':
    main()
